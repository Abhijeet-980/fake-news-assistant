/**
 * Scoring Engine Module
 * Combines all analysis factors into final credibility score
 */

const { analyzeDomain } = require('./domainAnalyzer');
const { analyzeLanguage } = require('./languageAnalyzer');
const { analyzeDateRelevance } = require('./dateAnalyzer');
const { analyzeFactChecks } = require('./factCheckAnalyzer');

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
    date: [
        'When was this originally published? Is it still relevant?',
        'Could this be old news being recirculated as new?',
        'Has the situation changed since this was first reported?'
    ],
    general: [
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
 * @param {Object} dateAnalysis - Date analysis result
 * @returns {string} - Summary text
 */
function generateSummary(score, domainAnalysis, languageAnalysis, dateAnalysis) {
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
        if (dateAnalysis && dateAnalysis.isOutdated) {
            issues.push('older publication date');
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
 * @param {Object} dateAnalysis - Date analysis result
 * @returns {string[]} - Selected prompts
 */
function selectThinkingPrompts(domainAnalysis, languageAnalysis, dateAnalysis) {
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

    // Add date-related prompts if content is old
    if (dateAnalysis && (dateAnalysis.isOutdated || dateAnalysis.isVeryOld)) {
        prompts.push(thinkingPrompts.date[Math.floor(Math.random() * thinkingPrompts.date.length)]);
    }

    // Always add some general prompts
    prompts.push(thinkingPrompts.general[Math.floor(Math.random() * thinkingPrompts.general.length)]);

    // Return unique prompts, max 4
    return [...new Set(prompts)].slice(0, 4);
}

/**
 * Generate recommendation based on score
 * @param {number} score - Credibility score
 * @param {Object} dateAnalysis - Date analysis result
 * @returns {string} - Recommendation text
 */
function generateRecommendation(score, dateAnalysis) {
    const status = getStatus(score);

    let recommendation = '';

    if (status.status === 'reliable') {
        recommendation = 'This content appears reliable, but we always encourage verifying important information with multiple sources.';
    } else if (status.status === 'needs_caution') {
        recommendation = 'We recommend cross-checking this information with established news organizations before sharing it on social media.';
    } else {
        recommendation = 'Please verify this information thoroughly with official sources before believing or sharing. Consider checking fact-checking websites.';
    }

    // Add date warning if applicable
    if (dateAnalysis && dateAnalysis.isVeryOld) {
        recommendation += ' Note: This content appears to be outdated - verify if the information is still current.';
    }

    return recommendation;
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
 * @param {Object} options - Optional parameters
 * @param {string} options.publishedDate - Published date from URL extraction
 * @param {boolean} options.skipFactCheck - Skip fact-check API (for faster response)
 * @returns {Promise<Object>} - Complete analysis result
 */
async function analyzeCredibility(text, options = {}) {
    const { publishedDate, skipFactCheck } = options;

    // Perform domain analysis
    const domainAnalysis = analyzeDomain(text);

    // Perform language analysis
    const languageAnalysis = analyzeLanguage(text);

    // Perform date analysis (pass published date if available)
    const dateAnalysis = analyzeDateRelevance(text, publishedDate);

    // Perform fact-check analysis (async)
    let factCheckAnalysis = null;
    if (!skipFactCheck) {
        try {
            factCheckAnalysis = await analyzeFactChecks(text);
        } catch (error) {
            console.error('[Fact-Check] Analysis failed:', error.message);
            factCheckAnalysis = {
                hasApiKey: false,
                factChecks: [],
                searchUrls: [],
                summary: null,
                score: 0
            };
        }
    }

    // Calculate total score (max 100)
    // Domain: 30 points, Emotional: 25 points, Sensationalism: 20 points, Evidence: 25 points
    // Date analysis adds bonus/penalty, Fact-check adds bonus/penalty
    let totalScore =
        domainAnalysis.score +
        languageAnalysis.emotional.score +
        languageAnalysis.sensationalism.score +
        languageAnalysis.evidence.score +
        (dateAnalysis.score || 0) +
        (factCheckAnalysis?.score || 0);

    // Clamp score between 0 and 100
    totalScore = Math.min(100, Math.max(0, totalScore));

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

    // Add date analysis reason
    if (dateAnalysis.reason) {
        reasons.push(dateAnalysis.reason);
    }

    // Add fact-check summary as a reason if exists
    if (factCheckAnalysis?.summary) {
        reasons.push(factCheckAnalysis.summary);
    }

    // Sort reasons: negative first, then warning, then positive
    const typeOrder = { negative: 0, warning: 1, info: 2, positive: 3 };
    reasons.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

    // Get status
    const statusInfo = getStatus(totalScore);

    // Generate outputs
    const summary = generateSummary(totalScore, domainAnalysis, languageAnalysis, dateAnalysis);
    const thinkingPromptsSelected = selectThinkingPrompts(domainAnalysis, languageAnalysis, dateAnalysis);
    const recommendation = generateRecommendation(totalScore, dateAnalysis);
    const searchUrl = generateSearchUrl(text);

    return {
        score: Math.round(totalScore),
        ...statusInfo,
        summary,
        reasons,
        thinkingPrompts: thinkingPromptsSelected,
        recommendation,
        searchUrl,
        factChecks: factCheckAnalysis ? {
            hasApiKey: factCheckAnalysis.hasApiKey,
            results: factCheckAnalysis.factChecks,
            searchUrls: factCheckAnalysis.searchUrls,
            score: factCheckAnalysis.score
        } : null,
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
            },
            date: {
                datesFound: dateAnalysis.datesFound,
                oldestDate: dateAnalysis.oldestDate ? dateAnalysis.oldestDate.toISOString().split('T')[0] : null,
                newestDate: dateAnalysis.newestDate ? dateAnalysis.newestDate.toISOString().split('T')[0] : null,
                ageInDays: dateAnalysis.ageInDays,
                isOutdated: dateAnalysis.isOutdated,
                isVeryOld: dateAnalysis.isVeryOld,
                score: dateAnalysis.score
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
