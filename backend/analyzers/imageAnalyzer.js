/**
 * Image Analyzer Module
 * Uses Google Cloud Vision API for reverse image search
 * Detects recycled/fake images in news articles
 */

const fetch = require('node-fetch');

// Get API key from environment
const VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Extract image URLs from article HTML
 * @param {string} html - The article HTML content
 * @param {string} baseUrl - The base URL for resolving relative paths
 * @returns {string[]} Array of image URLs
 */
function extractImagesFromHtml(html, baseUrl) {
    const images = [];

    // Match img tags with src attribute
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
        let imgUrl = match[1];

        // Skip data URLs, icons, and tiny images
        if (imgUrl.startsWith('data:')) continue;
        if (imgUrl.includes('icon') || imgUrl.includes('logo')) continue;
        if (imgUrl.includes('1x1') || imgUrl.includes('pixel')) continue;

        // Resolve relative URLs
        if (imgUrl.startsWith('//')) {
            imgUrl = 'https:' + imgUrl;
        } else if (imgUrl.startsWith('/')) {
            try {
                const url = new URL(baseUrl);
                imgUrl = url.origin + imgUrl;
            } catch (e) {
                continue;
            }
        } else if (!imgUrl.startsWith('http')) {
            try {
                imgUrl = new URL(imgUrl, baseUrl).href;
            } catch (e) {
                continue;
            }
        }

        // Filter out common non-content images
        const lowerUrl = imgUrl.toLowerCase();
        if (lowerUrl.includes('avatar') || lowerUrl.includes('author')) continue;
        if (lowerUrl.includes('advertisement') || lowerUrl.includes('ad-')) continue;
        if (lowerUrl.includes('button') || lowerUrl.includes('widget')) continue;
        if (lowerUrl.includes('.svg') || lowerUrl.includes('.gif')) continue;

        // Add unique images only
        if (!images.includes(imgUrl)) {
            images.push(imgUrl);
        }
    }

    // Also check for og:image meta tag (main article image)
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogImageMatch && ogImageMatch[1]) {
        const ogImage = ogImageMatch[1];
        if (!images.includes(ogImage) && !ogImage.startsWith('data:')) {
            images.unshift(ogImage); // Add as first image (main image)
        }
    }

    return images.slice(0, 5); // Limit to 5 images to avoid API overuse
}

/**
 * Analyze a single image using Vision API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Object} Analysis result
 */
async function analyzeImage(imageUrl) {
    if (!VISION_API_KEY) {
        console.log('[ImageAnalyzer] No Vision API key configured');
        return null;
    }

    try {
        const requestBody = {
            requests: [{
                image: {
                    source: {
                        imageUri: imageUrl
                    }
                },
                features: [
                    { type: 'WEB_DETECTION', maxResults: 10 }
                ]
            }]
        };

        const response = await fetch(`${VISION_API_URL}?key=${VISION_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[ImageAnalyzer] Vision API error:', errorText);
            return null;
        }

        const data = await response.json();
        const webDetection = data.responses?.[0]?.webDetection;

        if (!webDetection) {
            return {
                imageUrl,
                status: 'no_data',
                message: 'No web detection data available'
            };
        }

        // Process results
        const result = {
            imageUrl,
            status: 'analyzed',
            pagesWithMatchingImages: [],
            fullMatchingImages: [],
            partialMatchingImages: [],
            visuallySimilarImages: [],
            bestGuessLabels: [],
            isRecycled: false,
            recycleWarning: null
        };

        // Pages with matching images (most important for detecting recycled images)
        if (webDetection.pagesWithMatchingImages) {
            result.pagesWithMatchingImages = webDetection.pagesWithMatchingImages
                .slice(0, 5)
                .map(page => ({
                    url: page.url,
                    title: page.pageTitle || extractDomain(page.url)
                }));

            // If image appears on multiple pages, it might be recycled
            if (result.pagesWithMatchingImages.length >= 3) {
                result.isRecycled = true;
                result.recycleWarning = `This image appears on ${result.pagesWithMatchingImages.length}+ other websites`;
            }
        }

        // Full matching images
        if (webDetection.fullMatchingImages) {
            result.fullMatchingImages = webDetection.fullMatchingImages
                .slice(0, 3)
                .map(img => img.url);
        }

        // Visually similar images
        if (webDetection.visuallySimilarImages) {
            result.visuallySimilarImages = webDetection.visuallySimilarImages
                .slice(0, 3)
                .map(img => img.url);
        }

        // Best guess labels
        if (webDetection.bestGuessLabels) {
            result.bestGuessLabels = webDetection.bestGuessLabels
                .map(label => label.label);
        }

        return result;

    } catch (error) {
        console.error('[ImageAnalyzer] Error analyzing image:', error.message);
        return {
            imageUrl,
            status: 'error',
            message: error.message
        };
    }
}

/**
 * Extract domain from URL for display
 */
function extractDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
}

/**
 * Analyze all images in an article
 * @param {string} html - Article HTML content
 * @param {string} baseUrl - Article URL
 * @returns {Object} Image analysis results
 */
async function analyzeArticleImages(html, baseUrl) {
    console.log('[ImageAnalyzer] Starting image analysis for:', baseUrl);

    if (!VISION_API_KEY) {
        console.log('[ImageAnalyzer] Vision API key not configured, skipping');
        return {
            enabled: false,
            message: 'Image analysis not configured'
        };
    }

    // Extract images from HTML
    const imageUrls = extractImagesFromHtml(html, baseUrl);
    console.log(`[ImageAnalyzer] Found ${imageUrls.length} images to analyze`);

    if (imageUrls.length === 0) {
        return {
            enabled: true,
            images: [],
            summary: {
                total: 0,
                analyzed: 0,
                recycledCount: 0,
                message: 'No images found in article'
            }
        };
    }

    // Analyze each image (with rate limiting)
    const results = [];
    for (const imageUrl of imageUrls) {
        console.log(`[ImageAnalyzer] Analyzing: ${imageUrl.substring(0, 80)}...`);
        const result = await analyzeImage(imageUrl);
        if (result) {
            results.push(result);
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Count recycled images
    const recycledCount = results.filter(r => r.isRecycled).length;

    return {
        enabled: true,
        images: results,
        summary: {
            total: imageUrls.length,
            analyzed: results.length,
            recycledCount,
            message: recycledCount > 0
                ? `⚠️ ${recycledCount} image(s) appear to be recycled from other sources`
                : '✅ No recycled images detected'
        }
    };
}

module.exports = {
    extractImagesFromHtml,
    analyzeImage,
    analyzeArticleImages
};
