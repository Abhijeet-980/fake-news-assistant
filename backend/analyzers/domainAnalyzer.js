/**
 * Domain Analyzer Module
 * Extracts and analyzes domain credibility from URLs
 */

const trustedSources = require('../data/trusted_sources.json');
const suspiciousSources = require('../data/suspicious_sources.json');

/**
 * Extract domain from a URL string
 * @param {string} text - Text that may contain a URL
 * @returns {string|null} - Extracted domain or null
 */
/**
 * Extract domain from a URL string
 * @param {string} text - Text that may contain a URL
 * @returns {string|null} - Extracted domain or null
 */
function extractDomain(text) {
    // URL regex pattern with protocol
    const urlPattern = /https?:\/\/(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)/gi;
    let match = urlPattern.exec(text);

    if (match) {
        return match[1].toLowerCase();
    }

    // Try to match domain-like patterns without protocol (e.g., www.example.com or example.com)
    const domainPattern = /\b(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|gov|edu|co\.uk|co\.in|in|io|news|info|biz|tv|me|us|ca|au)(?:\.[a-zA-Z]{2,})?)\b/gi;
    const domainMatch = domainPattern.exec(text);

    if (domainMatch) {
        // Remove 'www.' if present
        let domain = domainMatch[1].toLowerCase();
        if (domain.startsWith('www.')) {
            domain = domain.substring(4);
        }
        return domain;
    }

    return null;
}

/**
 * Check if domain is in trusted sources list
 * @param {string} domain - Domain to check
 * @returns {boolean}
 */
function isTrustedDomain(domain) {
    if (!domain) return false;

    return trustedSources.domains.some(trusted => {
        return domain === trusted || domain.endsWith('.' + trusted);
    });
}

/**
 * Check if domain is in suspicious sources list
 * @param {string} domain - Domain to check
 * @returns {boolean}
 */
function isSuspiciousDomain(domain) {
    if (!domain) return false;

    // Check exact domain match
    if (suspiciousSources.domains.includes(domain)) {
        return true;
    }

    // Check suspicious URL patterns
    return suspiciousSources.suspiciousPatterns.some(pattern => {
        return domain.includes(pattern);
    });
}

/**
 * Analyze domain credibility
 * @param {string} text - Text or URL to analyze
 * @returns {Object} - Domain analysis result
 */
function analyzeDomain(text) {
    const domain = extractDomain(text);

    const result = {
        domain: domain,
        hasDomain: !!domain,
        isTrusted: false,
        isSuspicious: false,
        score: 15, // Default score for unknown domains
        reason: null
    };

    if (!domain) {
        result.reason = {
            type: 'info',
            title: 'No Source URL Detected',
            description: 'No website link was found in the content. Consider checking if this information comes from a reliable source.'
        };
        return result;
    }

    if (isTrustedDomain(domain)) {
        result.isTrusted = true;
        result.score = 30;
        result.reason = {
            type: 'positive',
            title: 'Verified Source Domain',
            description: `"${domain}" is recognized as a trusted and established news source.`
        };
    } else if (isSuspiciousDomain(domain)) {
        result.isSuspicious = true;
        result.score = 0;
        result.reason = {
            type: 'negative',
            title: 'Suspicious Source Domain',
            description: `"${domain}" has been flagged for spreading unreliable content in the past.`
        };
    } else {
        result.reason = {
            type: 'warning',
            title: 'Unknown Source Domain',
            description: `"${domain}" is not in our database of verified sources. Exercise caution.`
        };
    }

    return result;
}

module.exports = {
    extractDomain,
    isTrustedDomain,
    isSuspiciousDomain,
    analyzeDomain
};
