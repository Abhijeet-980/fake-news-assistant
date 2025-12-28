/**
 * URL Content Extractor Module
 * Fetches and extracts article content from URLs
 */

const cheerio = require('cheerio');
const fetch = require('node-fetch');

/**
 * Check if a string is a valid URL
 * @param {string} text - Text to check
 * @returns {boolean} - True if valid URL
 */
function isValidUrl(text) {
    try {
        const trimmed = text.trim();
        // Check if it starts with http:// or https:// or www.
        if (!/^(https?:\/\/|www\.)/i.test(trimmed)) {
            return false;
        }
        // Add protocol if missing
        const urlString = trimmed.startsWith('www.') ? `https://${trimmed}` : trimmed;
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
}

/**
 * Normalize URL (add protocol if missing)
 * @param {string} url - URL to normalize
 * @returns {string} - Normalized URL
 */
function normalizeUrl(url) {
    const trimmed = url.trim();
    if (trimmed.startsWith('www.')) {
        return `https://${trimmed}`;
    }
    return trimmed;
}

/**
 * Extract article content from HTML
 * @param {string} html - HTML content
 * @param {string} url - Original URL for context
 * @returns {Object} - Extracted content
 */
function extractArticleContent(html, url) {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar, .comments, .social-share, .related-posts, noscript, iframe').remove();

    // Try to extract title
    let title = '';
    const titleSelectors = [
        'h1.article-title',
        'h1.entry-title',
        'h1.post-title',
        'article h1',
        '.article-header h1',
        'h1',
        'meta[property="og:title"]',
        'title'
    ];

    for (const selector of titleSelectors) {
        if (selector.startsWith('meta')) {
            title = $(selector).attr('content') || '';
        } else {
            title = $(selector).first().text().trim();
        }
        if (title && title.length > 10) break;
    }

    // Try to extract article body
    let content = '';
    const contentSelectors = [
        'article',
        '.article-content',
        '.article-body',
        '.entry-content',
        '.post-content',
        '.story-body',
        '.content-body',
        'main article',
        'main',
        '.content'
    ];

    for (const selector of contentSelectors) {
        const element = $(selector).first();
        if (element.length) {
            // Get all paragraphs within this element
            const paragraphs = element.find('p').map((i, el) => $(el).text().trim()).get();
            content = paragraphs.filter(p => p.length > 30).join('\n\n');
            if (content.length > 200) break;
        }
    }

    // Fallback: get all paragraphs
    if (content.length < 200) {
        const allParagraphs = $('p').map((i, el) => $(el).text().trim()).get();
        content = allParagraphs.filter(p => p.length > 30).join('\n\n');
    }

    // Extract publication date
    let publishedDate = '';
    const dateSelectors = [
        'meta[property="article:published_time"]',
        'meta[name="pubdate"]',
        'meta[name="publishdate"]',
        'meta[name="date"]',
        'meta[property="og:published_time"]',
        'time[datetime]',
        '.published-date',
        '.article-date',
        '.post-date',
        '.date'
    ];

    for (const selector of dateSelectors) {
        if (selector.startsWith('meta')) {
            publishedDate = $(selector).attr('content') || '';
        } else if (selector.includes('[datetime]')) {
            publishedDate = $(selector).first().attr('datetime') || '';
        } else {
            publishedDate = $(selector).first().text().trim();
        }
        if (publishedDate) break;
    }

    // Extract author
    let author = '';
    const authorSelectors = [
        'meta[name="author"]',
        'meta[property="article:author"]',
        '.author-name',
        '.article-author',
        '.byline',
        '[rel="author"]'
    ];

    for (const selector of authorSelectors) {
        if (selector.startsWith('meta')) {
            author = $(selector).attr('content') || '';
        } else {
            author = $(selector).first().text().trim();
        }
        if (author) break;
    }

    // Extract description/summary
    let description = '';
    description = $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') || '';

    return {
        title: title.substring(0, 500),
        content: content.substring(0, 10000),
        description: description.substring(0, 500),
        publishedDate,
        author,
        url,
        wordCount: content.split(/\s+/).length
    };
}

/**
 * Fetch and extract content from a URL
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} - Extracted content or error
 */
async function fetchUrlContent(url) {
    try {
        const normalizedUrl = normalizeUrl(url);

        const response = await fetch(normalizedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            },
            timeout: 10000, // 10 second timeout
            redirect: 'follow'
        });

        if (!response.ok) {
            return {
                success: false,
                error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
                url: normalizedUrl
            };
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) {
            return {
                success: false,
                error: 'URL does not return HTML content',
                url: normalizedUrl
            };
        }

        const html = await response.text();
        const extracted = extractArticleContent(html, normalizedUrl);

        if (extracted.content.length < 50 && extracted.title.length < 20) {
            return {
                success: false,
                error: 'Could not extract meaningful content from the page',
                url: normalizedUrl
            };
        }

        return {
            success: true,
            ...extracted
        };

    } catch (error) {
        return {
            success: false,
            error: `Error fetching URL: ${error.message}`,
            url
        };
    }
}

/**
 * Combine extracted content into text for analysis
 * @param {Object} extracted - Extracted content
 * @returns {string} - Combined text
 */
function combineForAnalysis(extracted) {
    const parts = [];

    if (extracted.title) {
        parts.push(extracted.title);
    }

    if (extracted.publishedDate) {
        parts.push(`Published: ${extracted.publishedDate}`);
    }

    if (extracted.author) {
        parts.push(`Author: ${extracted.author}`);
    }

    if (extracted.description) {
        parts.push(extracted.description);
    }

    if (extracted.content) {
        parts.push(extracted.content);
    }

    // Also include the URL for domain analysis
    parts.push(`Source: ${extracted.url}`);

    return parts.join('\n\n');
}

module.exports = {
    isValidUrl,
    normalizeUrl,
    fetchUrlContent,
    extractArticleContent,
    combineForAnalysis
};
