/**
 * URL Content Extractor Module
 * Fetches and extracts article content from URLs
 * Features: Multiple user agents, retry logic, better browser simulation
 */

const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Rotate through realistic user agents
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
];

// Different header configurations to try
const HEADER_CONFIGS = [
    {
        name: 'Chrome Desktop',
        headers: (ua) => ({
            'User-Agent': ua,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
        })
    },
    {
        name: 'Firefox Desktop',
        headers: (ua) => ({
            'User-Agent': USER_AGENTS[2], // Firefox UA
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
        })
    },
    {
        name: 'Mobile Chrome',
        headers: (ua) => ({
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
    },
    {
        name: 'Googlebot (fallback)',
        headers: (ua) => ({
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en',
        })
    }
];

/**
 * Check if a string is a valid URL
 */
function isValidUrl(text) {
    try {
        const trimmed = text.trim();
        if (!/^(https?:\/\/|www\.)/i.test(trimmed)) {
            return false;
        }
        const urlString = trimmed.startsWith('www.') ? `https://${trimmed}` : trimmed;
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
}

/**
 * Normalize URL
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
 */
function extractArticleContent(html, url) {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar, .comments, .social-share, .related-posts, noscript, iframe, .cookie-banner, .newsletter-signup').remove();

    // Try to extract title
    let title = '';
    const titleSelectors = [
        'h1.article-title', 'h1.entry-title', 'h1.post-title', 'article h1',
        '.article-header h1', '.story-title', '.headline', 'h1',
        'meta[property="og:title"]', 'title'
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
        'article', '.article-content', '.article-body', '.entry-content',
        '.post-content', '.story-body', '.content-body', '.story-content',
        '.article__body', '.post-body', 'main article', 'main', '.content'
    ];

    for (const selector of contentSelectors) {
        const element = $(selector).first();
        if (element.length) {
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
        'meta[property="article:published_time"]', 'meta[name="pubdate"]',
        'meta[name="publishdate"]', 'meta[name="date"]',
        'meta[property="og:published_time"]', 'time[datetime]',
        '.published-date', '.article-date', '.post-date', '.date', '.timestamp'
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
        'meta[name="author"]', 'meta[property="article:author"]',
        '.author-name', '.article-author', '.byline', '[rel="author"]', '.author'
    ];

    for (const selector of authorSelectors) {
        if (selector.startsWith('meta')) {
            author = $(selector).attr('content') || '';
        } else {
            author = $(selector).first().text().trim();
        }
        if (author) break;
    }

    // Extract description
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
        wordCount: content.split(/\s+/).filter(w => w.length > 0).length
    };
}

/**
 * Attempt to fetch URL with a specific header configuration
 */
async function attemptFetch(url, config, userAgent) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, {
            headers: config.headers(userAgent),
            signal: controller.signal,
            redirect: 'follow'
        });

        clearTimeout(timeout);
        return response;
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

/**
 * Fetch and extract content from a URL with retry logic
 */
async function fetchUrlContent(url) {
    const normalizedUrl = normalizeUrl(url);
    const attempts = [];

    // Try each header configuration
    for (let i = 0; i < HEADER_CONFIGS.length; i++) {
        const config = HEADER_CONFIGS[i];
        const userAgent = USER_AGENTS[i % USER_AGENTS.length];

        try {
            console.log(`[URL Fetch] Attempt ${i + 1}/${HEADER_CONFIGS.length} using ${config.name}...`);

            const response = await attemptFetch(normalizedUrl, config, userAgent);

            attempts.push({
                attempt: i + 1,
                config: config.name,
                status: response.status,
                success: response.ok
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
                    continue; // Try next config
                }

                const html = await response.text();
                const extracted = extractArticleContent(html, normalizedUrl);

                if (extracted.content.length < 50 && extracted.title.length < 20) {
                    // Content extraction failed, try next config
                    continue;
                }

                console.log(`[URL Fetch] Success with ${config.name}! Extracted ${extracted.wordCount} words.`);

                return {
                    success: true,
                    ...extracted,
                    rawHtml: html, // Include raw HTML for image extraction
                    fetchMethod: config.name,
                    attemptsCount: i + 1
                };
            }

            // If we get a 403/429, try next config
            if (response.status === 403 || response.status === 429 || response.status === 503) {
                console.log(`[URL Fetch] Got ${response.status}, trying next config...`);
                continue;
            }

            // For other errors, still try next config
            console.log(`[URL Fetch] Got ${response.status} ${response.statusText}`);

        } catch (error) {
            attempts.push({
                attempt: i + 1,
                config: config.name,
                error: error.message
            });
            console.log(`[URL Fetch] Error with ${config.name}: ${error.message}`);
        }

        // Small delay between attempts
        if (i < HEADER_CONFIGS.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // All attempts failed
    const lastAttempt = attempts[attempts.length - 1];
    const errorMessage = lastAttempt?.error ||
        (lastAttempt?.status ? `HTTP ${lastAttempt.status}` : 'Unknown error');

    return {
        success: false,
        error: `Could not fetch article content after ${attempts.length} attempts. The website may be blocking automated access.`,
        errorDetails: errorMessage,
        attempts: attempts,
        url: normalizedUrl,
        suggestion: 'Try copying and pasting the article text directly instead of the URL.'
    };
}

/**
 * Combine extracted content into text for analysis
 */
function combineForAnalysis(extracted) {
    const parts = [];

    if (extracted.title) parts.push(extracted.title);
    if (extracted.publishedDate) parts.push(`Published: ${extracted.publishedDate}`);
    if (extracted.author) parts.push(`Author: ${extracted.author}`);
    if (extracted.description) parts.push(extracted.description);
    if (extracted.content) parts.push(extracted.content);
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
