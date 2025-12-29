/**
 * Image Analyzer Module
 * Uses Google Cloud Vision API for reverse image search
 * Detects recycled/fake images in news articles
 * 
 * Smart detection:
 * - Excludes same-domain reuse (normal for news sites)
 * - Identifies wire service photos (Reuters, AP, AFP, etc.)
 * - Provides context-aware warnings
 */

const fetch = require('node-fetch');

// Get API key from environment
const VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// Wire services and photo agencies - images from these are expected to appear everywhere
const WIRE_SERVICES = [
    'reuters.com', 'apnews.com', 'afp.com', 'gettyimages.com', 'shutterstock.com',
    'alamy.com', 'istockphoto.com', 'pexels.com', 'unsplash.com', 'pixabay.com',
    'aninews.in', 'pti.in', 'ians.in', 'bccl.in', 'timesofindia', 'indiatimes.com'
];

/**
 * Check if a URL belongs to a wire service or stock photo site
 */
function isWireServiceUrl(url) {
    const lowerUrl = url.toLowerCase();
    return WIRE_SERVICES.some(service => lowerUrl.includes(service));
}

/**
 * Extract root domain from URL (e.g., "www.indiatoday.in" -> "indiatoday.in")
 */
function getRootDomain(url) {
    try {
        const hostname = new URL(url).hostname;
        const parts = hostname.split('.');
        // Handle cases like "www.indiatoday.in" or "news.indiatoday.in"
        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }
        return hostname;
    } catch {
        return '';
    }
}

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
 * Analyze a single image using Vision API with smart context detection
 * @param {string} imageUrl - URL of the image to analyze
 * @param {string} articleDomain - Domain of the article being analyzed
 * @returns {Object} Analysis result
 */
async function analyzeImage(imageUrl, articleDomain) {
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
                    { type: 'WEB_DETECTION', maxResults: 15 }
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

        // Process results with smart filtering
        const result = {
            imageUrl,
            status: 'analyzed',
            pagesWithMatchingImages: [],
            externalPages: [], // Pages from different domains
            sameDomainPages: [], // Pages from same publisher
            wireServiceSource: null,
            fullMatchingImages: [],
            visuallySimilarImages: [],
            bestGuessLabels: [],
            isRecycled: false,
            isSuspicious: false,
            recycleWarning: null,
            context: 'original' // 'original', 'wire_photo', 'stock_photo', 'recycled', 'suspicious'
        };

        // Pages with matching images
        if (webDetection.pagesWithMatchingImages) {
            const allPages = webDetection.pagesWithMatchingImages.slice(0, 10);

            for (const page of allPages) {
                const pageInfo = {
                    url: page.url,
                    title: page.pageTitle || extractDomain(page.url),
                    domain: getRootDomain(page.url)
                };

                result.pagesWithMatchingImages.push(pageInfo);

                // Categorize: same domain vs external
                if (pageInfo.domain === articleDomain ||
                    pageInfo.domain.includes(articleDomain) ||
                    articleDomain.includes(pageInfo.domain)) {
                    result.sameDomainPages.push(pageInfo);
                } else {
                    result.externalPages.push(pageInfo);

                    // Check if it's from a wire service
                    if (isWireServiceUrl(page.url)) {
                        result.wireServiceSource = pageInfo;
                    }
                }
            }

            // Smart recycled detection
            const externalCount = result.externalPages.length;
            const hasWireSource = result.wireServiceSource !== null;

            if (hasWireSource) {
                // Wire service photo - this is normal
                result.context = 'wire_photo';
                result.isRecycled = false;
                result.recycleWarning = `📸 Wire/Agency photo (found on ${externalCount} sites) - This is normal for news photos`;
            } else if (externalCount >= 5) {
                // Many external sources without wire service attribution - suspicious
                result.context = 'suspicious';
                result.isRecycled = true;
                result.isSuspicious = true;
                result.recycleWarning = `⚠️ This image appears on ${externalCount}+ unrelated websites without clear original source`;
            } else if (externalCount >= 3) {
                // Some external sources - might be recycled
                result.context = 'recycled';
                result.isRecycled = true;
                result.recycleWarning = `This image appears on ${externalCount} other websites`;
            } else if (result.sameDomainPages.length > 0 && externalCount < 2) {
                // Mostly same-domain - likely original or reused by same publisher
                result.context = 'original';
                result.isRecycled = false;
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
 * Analyze all images in an article with smart context detection
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

    const articleDomain = getRootDomain(baseUrl);
    console.log(`[ImageAnalyzer] Article domain: ${articleDomain}`);

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
                suspiciousCount: 0,
                wirePhotoCount: 0,
                message: 'No images found in article'
            }
        };
    }

    // Analyze each image (with rate limiting)
    const results = [];
    for (const imageUrl of imageUrls) {
        console.log(`[ImageAnalyzer] Analyzing: ${imageUrl.substring(0, 80)}...`);
        const result = await analyzeImage(imageUrl, articleDomain);
        if (result) {
            results.push(result);
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Count different types
    const suspiciousCount = results.filter(r => r.isSuspicious).length;
    const recycledCount = results.filter(r => r.isRecycled).length;
    const wirePhotoCount = results.filter(r => r.context === 'wire_photo').length;

    // Generate smart summary message
    let message = '';
    if (suspiciousCount > 0) {
        message = `⚠️ ${suspiciousCount} image(s) may be recycled from unrelated sources - verify before sharing`;
    } else if (recycledCount > 0) {
        message = `ℹ️ ${recycledCount} image(s) found on other sites, but this may be normal`;
    } else if (wirePhotoCount > 0) {
        message = `📸 ${wirePhotoCount} wire/agency photo(s) detected - this is normal for news`;
    } else {
        message = '✅ Images appear to be original or properly sourced';
    }

    return {
        enabled: true,
        images: results,
        summary: {
            total: imageUrls.length,
            analyzed: results.length,
            recycledCount,
            suspiciousCount,
            wirePhotoCount,
            message
        }
    };
}

module.exports = {
    extractImagesFromHtml,
    analyzeImage,
    analyzeArticleImages,
    isWireServiceUrl,
    getRootDomain
};
