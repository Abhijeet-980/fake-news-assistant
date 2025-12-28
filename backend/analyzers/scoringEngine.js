/**
 * Scoring Engine Module
 * Combines all analysis factors into final credibility score
 */

const { analyzeDomain } = require('./domainAnalyzer');
const { analyzeLanguage } = require('./languageAnalyzer');

// Critical thinking prompts based on content type
const thinkingPrompts = {
    emotional: [
        'Does this headline make you feel angry, scared, or outraged?',
        'Would you share this if the headline was less dramatic?',
        'Are your emotions influencing your judgment of this content?'
    ],
    source: [
        'Have you heard of this news source before?',
        'Are other major news outlets reporting this story?',
        'Can you find the original source of this information?'
    ],
    evidence: [
        'Does the article cite specific sources or experts?',
        'Can you verify the statistics or claims independently?',
        'Are there links to primary sources or official statements?'
    ],
    general: [
        'When was this originally published? Is it still relevant?',
        'Who benefits if you believe and share this story?',
        'What might be missing from this narrative?',
        'Have you read beyond just the headline?'
    ]
};

/**
 * Get status based on score
 * @param {number} score - Credibility score (0-100)
 * @returns {Object} - Status information
 */
function getStatus(score) {
    if (score >= 80) {
        return {
            status: 'reliable',
            statusLabel: 'Likely Reliable',
            statusColor: 'green',
            icon: 'verified'
        };
    } else if (score >= 50) {
        return {
            status: 'needs_caution',
            statusLabel: 'Needs Caution',
            statusColor: 'yellow',
            icon: 'warning'
        };
    } else {
        return {
            status: 'suspicious',
            statusLabel: 'Suspicious',
            statusColor: 'red',
            icon: 'error'
        };
    }
}

/**
 * Generate summary based on analysis
 * @param {number} score - Credibility score
 * @param {Object} domainAnalysis - Domain analysis result
 * @param {Object} languageAnalysis - Language analysis result
 * @returns {string} - Summary text
 */
function generateSummary(score, domainAnalysis, languageAnalysis) {
    const status = getStatus(score);

    if (status.status === 'reliable') {
        if (domainAnalysis.isTrusted) {
            return 'This content appears credible and comes from a trusted source. The writing style is professional and evidence-based.';
        }
        return 'This content shows signs of reliable reporting with professional language and cited sources.';
    } else if (status.status === 'needs_caution') {
        const issues = [];
        if (!domainAnalysis.isTrusted && domainAnalysis.hasDomain) {
            issues.push('unknown source');
        }
        if (languageAnalysis.emotional.score < 25) {
            issues.push('emotional language');
        }
        if (languageAnalysis.evidence.score < 25) {
            issues.push('limited evidence');
        }
        return `This content shows mixed credibility signals including ${issues.join(' and ')}. We recommend verifying with additional sources.`;
    } else {
        return 'This content shows multiple warning signs that suggest low credibility. Please verify thoroughly before trusting or sharing.';
    }
}

/**
 * Select relevant thinking prompts
 * @param {Object} domainAnalysis - Domain analysis result
 * @param {Object} languageAnalysis - Language analysis result
 * @returns {string[]} - Selected prompts
 */
function selectThinkingPrompts(domainAnalysis, languageAnalysis) {
    const prompts = [];

    // Add prompts based on issues found
    if (languageAnalysis.emotional.score < 25) {
        prompts.push(thinkingPrompts.emotional[Math.floor(Math.random() * thinkingPrompts.emotional.length)]);
    }

    if (!domainAnalysis.isTrusted) {
        prompts.push(thinkingPrompts.source[Math.floor(Math.random() * thinkingPrompts.source.length)]);
    }

    if (languageAnalysis.evidence.score < 25) {
        prompts.push(thinkingPrompts.evidence[Math.floor(Math.random() * thinkingPrompts.evidence.length)]);
    }

    // Always add some general prompts
    prompts.push(thinkingPrompts.general[Math.floor(Math.random() * thinkingPrompts.general.length)]);

    // Return unique prompts, max 4
    return [...new Set(prompts)].slice(0, 4);
}

/**
 * Generate recommendation based on score
 * @param {number} score - Credibility score
 * @returns {string} - Recommendation text
 */
function generateRecommendation(score) {
    const status = getStatus(score);

    if (status.status === 'reliable') {
        return 'This content appears reliable, but we always encourage verifying important information with multiple sources.';
    } else if (status.status === 'needs_caution') {
        return 'We recommend cross-checking this information with established news organizations before sharing it on social media.';
    } else {
        return 'Please verify this information thoroughly with official sources before believing or sharing. Consider checking fact-checking websites.';
    }
}

/**
 * Generate Google News search URL
 * @param {string} text - Original text
 * @returns {string} - Google News search URL
 */
function generateSearchUrl(text) {
    // Extract key phrases for search (first 10 significant words)
    const words = text
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 10)
        .join(' ');

    return `https://news.google.com/search?q=${encodeURIComponent(words)}`;
}

/**
 * Perform complete credibility analysis
 * @param {string} text - Text or URL to analyze
 * @returns {Object} - Complete analysis result
 */
function analyzeCredibility(text) {
    // Perform domain analysis
    const domainAnalysis = analyzeDomain(text);

    // Perform language analysis
    const languageAnalysis = analyzeLanguage(text);

    // Calculate total score (max 100)
    // Domain: 30 points, Emotional: 25 points, Sensationalism: 20 points, Evidence: 25 points
    const totalScore = Math.min(100, Math.max(0,
        domainAnalysis.score +
        languageAnalysis.emotional.score +
        languageAnalysis.sensationalism.score +
        languageAnalysis.evidence.score
    ));

    // Collect all reasons
    const reasons = [];

    if (domainAnalysis.reason) {
        reasons.push(domainAnalysis.reason);
    }

    if (languageAnalysis.emotional.reason) {
        reasons.push(languageAnalysis.emotional.reason);
    }

    if (languageAnalysis.sensationalism.reason) {
        reasons.push(languageAnalysis.sensationalism.reason);
    }

    if (languageAnalysis.evidence.reason) {
        reasons.push(languageAnalysis.evidence.reason);
    }

    // Sort reasons: negative first, then warning, then positive
    const typeOrder = { negative: 0, warning: 1, info: 2, positive: 3 };
    reasons.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

    // Get status
    const statusInfo = getStatus(totalScore);

    // Generate outputs
    const summary = generateSummary(totalScore, domainAnalysis, languageAnalysis);
    const thinkingPromptsSelected = selectThinkingPrompts(domainAnalysis, languageAnalysis);
    const recommendation = generateRecommendation(totalScore);
    const searchUrl = generateSearchUrl(text);

    return {
        score: Math.round(totalScore),
        ...statusInfo,
        summary,
        reasons,
        thinkingPrompts: thinkingPromptsSelected,
        recommendation,
        searchUrl,
        analysis: {
            domain: {
                detected: domainAnalysis.domain,
                isTrusted: domainAnalysis.isTrusted,
                isSuspicious: domainAnalysis.isSuspicious,
                score: domainAnalysis.score
            },
            language: {
                emotionalScore: languageAnalysis.emotional.score,
                sensationalismScore: languageAnalysis.sensationalism.score,
                evidenceScore: languageAnalysis.evidence.score,
                emotionalWordsFound: languageAnalysis.emotional.foundEmotionalWords,
                hasQuotes: languageAnalysis.evidence.hasQuotes,
                hasStatistics: languageAnalysis.evidence.hasStatistics
            }
        }
    };
}

module.exports = {
    analyzeCredibility,
    getStatus,
    generateSummary,
    generateRecommendation
};
