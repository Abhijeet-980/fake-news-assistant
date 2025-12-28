/**
 * Fact-Check Analyzer Module
 * Integrates with Google Fact Check Tools API to find related fact-checks
 * Also provides fallback search URLs for manual verification
 */

const fetch = require('node-fetch');

// Google Fact Check API configuration
// To use this, set GOOGLE_FACTCHECK_API_KEY in environment variables
const FACTCHECK_API_BASE = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

// Known fact-checking organizations
const FACTCHECK_ORGS = [
    { name: 'Snopes', domain: 'snopes.com', color: '#4a90d9' },
    { name: 'PolitiFact', domain: 'politifact.com', color: '#c41e3a' },
    { name: 'FactCheck.org', domain: 'factcheck.org', color: '#1a5f7a' },
    { name: 'AFP Fact Check', domain: 'factcheck.afp.com', color: '#0066cc' },
    { name: 'Reuters Fact Check', domain: 'reuters.com/fact-check', color: '#ff8000' },
    { name: 'AP Fact Check', domain: 'apnews.com/APFactCheck', color: '#ff322e' },
    { name: 'Full Fact (UK)', domain: 'fullfact.org', color: '#006699' },
    { name: 'Alt News (India)', domain: 'altnews.in', color: '#e74c3c' },
    { name: 'Boom (India)', domain: 'boomlive.in', color: '#f39c12' },
    { name: 'The Quint (India)', domain: 'thequint.com/news/webqoof', color: '#d4af37' }
];

/**
 * Extract key claims/phrases from text for searching
 * @param {string} text - Text to extract claims from
 * @returns {string[]} - Array of potential claims
 */
function extractKeyPhrases(text) {
    // Remove URLs
    const cleanText = text.replace(/https?:\/\/[^\s]+/g, '');

    // Split into sentences
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);

    // Get first 3 meaningful sentences (likely to contain main claims)
    const claims = sentences.slice(0, 3).map(s => s.trim());

    // Also extract any quoted text (often contains claims)
    const quotes = text.match(/"[^"]{20,}"/g) || [];
    claims.push(...quotes.map(q => q.replace(/"/g, '')));

    // Extract text after "claim" keywords
    const claimPatterns = /(?:claim(?:s|ed)?|said|stated|announced|reported)\s*(?:that)?\s*([^.!?]{20,})/gi;
    let match;
    while ((match = claimPatterns.exec(text)) !== null) {
        claims.push(match[1].trim());
    }

    return [...new Set(claims)].slice(0, 5); // Unique, max 5 claims
}

/**
 * Search Google Fact Check API for related fact-checks
 * @param {string} query - Search query
 * @param {string} apiKey - Google API key
 * @returns {Promise<Object>} - Fact-check results
 */
async function searchGoogleFactCheck(query, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'No API key provided' };
    }

    try {
        const params = new URLSearchParams({
            query: query.substring(0, 500), // API limit
            key: apiKey,
            pageSize: '5',
            languageCode: 'en'
        });

        const response = await fetch(`${FACTCHECK_API_BASE}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return {
                success: false,
                error: `API error: ${response.status}`
            };
        }

        const data = await response.json();

        if (!data.claims || data.claims.length === 0) {
            return {
                success: true,
                found: false,
                message: 'No fact-checks found for this content'
            };
        }

        // Parse and format the results
        const factChecks = data.claims.map(claim => ({
            claimText: claim.text,
            claimant: claim.claimant,
            claimDate: claim.claimDate,
            reviews: (claim.claimReview || []).map(review => ({
                publisher: review.publisher?.name,
                publisherSite: review.publisher?.site,
                url: review.url,
                title: review.title,
                rating: review.textualRating,
                ratingValue: review.reviewRating?.ratingValue,
                reviewDate: review.reviewDate,
                languageCode: review.languageCode
            }))
        }));

        return {
            success: true,
            found: true,
            count: factChecks.length,
            factChecks: factChecks
        };

    } catch (error) {
        return {
            success: false,
            error: `Fetch error: ${error.message}`
        };
    }
}

/**
 * Generate search URLs for major fact-checking sites
 * @param {string} query - Search query
 * @returns {Object[]} - Array of search URLs
 */
function generateFactCheckSearchUrls(query) {
    const encodedQuery = encodeURIComponent(query.substring(0, 200));

    return [
        {
            name: 'Google Fact Check Explorer',
            url: `https://toolbox.google.com/factcheck/explorer/search/${encodedQuery}`,
            icon: 'fact_check',
            description: 'Search all verified fact-checkers'
        },
        {
            name: 'Snopes',
            url: `https://www.snopes.com/?s=${encodedQuery}`,
            icon: 'search',
            description: 'Popular fact-checking site since 1994'
        },
        {
            name: 'PolitiFact',
            url: `https://www.politifact.com/search/?q=${encodedQuery}`,
            icon: 'gavel',
            description: 'Pulitzer Prize-winning political fact-checker'
        },
        {
            name: 'FactCheck.org',
            url: `https://www.factcheck.org/?s=${encodedQuery}`,
            icon: 'verified',
            description: 'Annenberg Public Policy Center project'
        },
        {
            name: 'AFP Fact Check',
            url: `https://factcheck.afp.com/list/all/all/${encodedQuery}`,
            icon: 'language',
            description: 'Global fact-checking by AFP'
        },
        {
            name: 'Alt News (India)',
            url: `https://www.altnews.in/?s=${encodedQuery}`,
            icon: 'flag',
            description: 'Indian fact-checking platform'
        }
    ];
}

/**
 * Format fact-check rating for display
 * @param {string} rating - Rating text from API
 * @returns {Object} - Formatted rating with color
 */
function formatRating(rating) {
    const lowerRating = (rating || '').toLowerCase();

    // Map common ratings to colors
    if (lowerRating.includes('true') && !lowerRating.includes('false') && !lowerRating.includes('partly')) {
        return { text: rating, color: '#22c55e', icon: 'check_circle' };
    }
    if (lowerRating.includes('false') || lowerRating.includes('pants on fire') || lowerRating.includes('fake')) {
        return { text: rating, color: '#ef4444', icon: 'cancel' };
    }
    if (lowerRating.includes('partly') || lowerRating.includes('half') || lowerRating.includes('mixed') || lowerRating.includes('misleading')) {
        return { text: rating, color: '#eab308', icon: 'warning' };
    }
    if (lowerRating.includes('unproven') || lowerRating.includes('unverified') || lowerRating.includes('unknown')) {
        return { text: rating, color: '#6b7280', icon: 'help' };
    }

    return { text: rating, color: '#3b82f6', icon: 'info' };
}

/**
 * Analyze content for fact-checks
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} - Fact-check analysis result
 */
async function analyzeFactChecks(text) {
    // API key - either from environment or hardcoded for demo
    const apiKey = process.env.GOOGLE_FACTCHECK_API_KEY || 'AIzaSyCgXWcZmFDrYgcPcQ4s2UbH-qhi243Yi_s';
    const keyPhrases = extractKeyPhrases(text);

    const result = {
        hasApiKey: !!apiKey,
        queriesSearched: keyPhrases,
        factChecks: [],
        searchUrls: [],
        summary: null,
        score: 0 // Bonus/penalty based on fact-check results
    };

    // Generate search URLs for manual verification
    const primaryQuery = keyPhrases[0] || text.substring(0, 100);
    result.searchUrls = generateFactCheckSearchUrls(primaryQuery);

    // If we have an API key, search the API
    if (apiKey && keyPhrases.length > 0) {
        console.log(`[Fact-Check] Searching Google Fact Check API for ${keyPhrases.length} claims...`);

        for (const phrase of keyPhrases.slice(0, 3)) { // Limit to 3 API calls
            const apiResult = await searchGoogleFactCheck(phrase, apiKey);

            if (apiResult.success && apiResult.found) {
                for (const fc of apiResult.factChecks) {
                    // Format each review
                    for (const review of fc.reviews) {
                        const formattedRating = formatRating(review.rating);
                        result.factChecks.push({
                            claim: fc.claimText,
                            claimant: fc.claimant,
                            publisher: review.publisher,
                            publisherSite: review.publisherSite,
                            url: review.url,
                            title: review.title,
                            rating: formattedRating.text,
                            ratingColor: formattedRating.color,
                            ratingIcon: formattedRating.icon,
                            reviewDate: review.reviewDate
                        });
                    }
                }
            }
        }

        // Deduplicate by URL
        const seen = new Set();
        result.factChecks = result.factChecks.filter(fc => {
            if (seen.has(fc.url)) return false;
            seen.add(fc.url);
            return true;
        }).slice(0, 5); // Max 5 results

        console.log(`[Fact-Check] Found ${result.factChecks.length} related fact-checks`);
    }

    // Generate summary and score
    if (result.factChecks.length > 0) {
        // Check if any fact-checks found claims to be false
        const hasfalse = result.factChecks.some(fc =>
            fc.rating && (
                fc.rating.toLowerCase().includes('false') ||
                fc.rating.toLowerCase().includes('fake') ||
                fc.rating.toLowerCase().includes('pants on fire')
            )
        );

        const hasTrue = result.factChecks.some(fc =>
            fc.rating && fc.rating.toLowerCase().includes('true') && !fc.rating.toLowerCase().includes('false')
        );

        if (hasfalse) {
            result.summary = {
                type: 'negative',
                title: 'Related Claims Previously Debunked',
                description: `Similar claims have been fact-checked and rated as FALSE by ${result.factChecks[0].publisher || 'fact-checkers'}. Please review the fact-checks below.`
            };
            result.score = -15; // Significant penalty
        } else if (hasTrue) {
            result.summary = {
                type: 'positive',
                title: 'Related Claims Verified',
                description: `Similar claims have been independently verified by ${result.factChecks[0].publisher || 'fact-checkers'}.`
            };
            result.score = 10; // Bonus for verified claims
        } else {
            result.summary = {
                type: 'info',
                title: 'Related Fact-Checks Found',
                description: `We found ${result.factChecks.length} related fact-check(s). Review them for more context.`
            };
            result.score = 0;
        }
    } else {
        result.summary = {
            type: 'info',
            title: 'No Direct Fact-Checks Found',
            description: 'No existing fact-checks matched this content. Use the links below to search manually.'
        };
    }

    return result;
}

module.exports = {
    analyzeFactChecks,
    searchGoogleFactCheck,
    generateFactCheckSearchUrls,
    extractKeyPhrases,
    formatRating,
    FACTCHECK_ORGS
};
