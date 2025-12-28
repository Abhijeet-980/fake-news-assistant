/**
 * Language Analyzer Module
 * Detects emotional tone, sensationalism, and evidence presence
 */

// Emotional/fear-based words
const emotionalWords = [
    // Fear-inducing
    'terrifying', 'horrifying', 'shocking', 'alarming', 'devastating',
    'catastrophic', 'crisis', 'emergency', 'urgent', 'danger', 'deadly',
    'fatal', 'lethal', 'nightmare', 'horror', 'terror', 'panic',
    'doomed', 'destroyed', 'chaos', 'collapse', 'disaster', 'apocalypse',

    // Anger-inducing
    'outrage', 'outrageous', 'scandalous', 'disgrace', 'disgusting',
    'shameful', 'unbelievable', 'unacceptable', 'corrupt', 'evil',
    'betrayal', 'traitor', 'treachery', 'villain', 'criminal',

    // Sensational adjectives
    'incredible', 'unbelievable', 'mind-blowing', 'jaw-dropping',
    'earth-shattering', 'game-changing', 'revolutionary', 'explosive',
    'bombshell', 'breaking', 'exclusive', 'secret', 'hidden', 'exposed',
    'revealed', 'leaked', 'banned', 'censored', 'suppressed'
];

// Clickbait phrases
const clickbaitPhrases = [
    'you won\'t believe',
    'what happens next',
    'doctors hate',
    'one weird trick',
    'they don\'t want you to know',
    'the truth about',
    'exposed',
    'government doesn\'t want',
    'media won\'t tell you',
    'finally revealed',
    'breaking news',
    'just in',
    'developing story',
    'this changes everything',
    'share before deleted',
    'going viral',
    'must see',
    'must read',
    'urgent warning'
];

// Evidence indicators
const evidenceIndicators = [
    'according to', 'study shows', 'research indicates', 'scientists say',
    'experts say', 'officials confirm', 'data shows', 'statistics show',
    'survey found', 'report states', 'analysis reveals', 'evidence suggests',
    'source:', 'cited', 'peer-reviewed', 'published in', 'journal',
    'university', 'institute', 'organization', 'spokesperson',
    'ministry', 'department', 'official statement', 'press release',
    'confirmed by', 'verified by', 'fact-check'
];

/**
 * Count emotional words in text
 * @param {string} text - Text to analyze
 * @returns {Object} - Emotional words analysis
 */
function analyzeEmotionalTone(text) {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    const totalWords = words.length;

    let emotionalCount = 0;
    const foundEmotionalWords = [];

    emotionalWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
            emotionalCount += matches.length;
            if (!foundEmotionalWords.includes(word)) {
                foundEmotionalWords.push(word);
            }
        }
    });

    // Check for clickbait phrases
    let clickbaitCount = 0;
    const foundClickbait = [];

    clickbaitPhrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
            clickbaitCount++;
            foundClickbait.push(phrase);
        }
    });

    // Calculate emotional density (percentage of emotional words)
    const emotionalDensity = totalWords > 0 ? (emotionalCount / totalWords) * 100 : 0;

    // Score calculation (25 points max)
    let score = 25;
    if (emotionalDensity > 5 || clickbaitCount >= 2) {
        score = 0; // High emotional content
    } else if (emotionalDensity > 2 || clickbaitCount >= 1) {
        score = 12; // Moderate emotional content
    }

    let reason = null;
    if (score < 25) {
        reason = {
            type: score === 0 ? 'negative' : 'warning',
            title: 'Emotional Language Detected',
            description: foundEmotionalWords.length > 0
                ? `Uses emotionally charged words like "${foundEmotionalWords.slice(0, 3).join('", "')}" which may influence your judgment.`
                : `Contains clickbait phrases designed to provoke strong reactions.`
        };
    }

    return {
        emotionalCount,
        emotionalDensity: emotionalDensity.toFixed(2),
        clickbaitCount,
        foundEmotionalWords: foundEmotionalWords.slice(0, 5),
        foundClickbait,
        score,
        reason
    };
}

/**
 * Analyze sensationalism indicators (ALL CAPS, exclamation marks)
 * @param {string} text - Text to analyze
 * @returns {Object} - Sensationalism analysis
 */
function analyzeSensationalism(text) {
    const words = text.split(/\s+/);
    const totalWords = words.length;

    // Count ALL CAPS words (3+ letters)
    const capsWords = words.filter(word => {
        const cleaned = word.replace(/[^A-Za-z]/g, '');
        return cleaned.length >= 3 && cleaned === cleaned.toUpperCase();
    });

    // Count exclamation marks
    const exclamationCount = (text.match(/!/g) || []).length;

    // Count question marks (often used in clickbait)
    const questionCount = (text.match(/\?/g) || []).length;

    const capsPercentage = totalWords > 0 ? (capsWords.length / totalWords) * 100 : 0;
    const exclamationDensity = totalWords > 0 ? (exclamationCount / totalWords) * 100 : 0;

    // Score calculation (20 points max)
    let score = 20;
    if (capsPercentage > 10 || exclamationCount > 5) {
        score = 0; // Highly sensational
    } else if (capsPercentage > 5 || exclamationCount > 2) {
        score = 10; // Moderately sensational
    }

    let reason = null;
    if (score < 20) {
        const issues = [];
        if (capsPercentage > 5) issues.push('excessive ALL CAPS text');
        if (exclamationCount > 2) issues.push('multiple exclamation marks');

        reason = {
            type: score === 0 ? 'negative' : 'warning',
            title: 'Sensational Writing Style',
            description: `The text contains ${issues.join(' and ')}, which is often used to exaggerate importance.`
        };
    }

    return {
        capsWordsCount: capsWords.length,
        capsPercentage: capsPercentage.toFixed(2),
        exclamationCount,
        questionCount,
        score,
        reason
    };
}

/**
 * Analyze evidence presence in text
 * @param {string} text - Text to analyze
 * @returns {Object} - Evidence analysis
 */
function analyzeEvidence(text) {
    const lowerText = text.toLowerCase();

    let evidenceCount = 0;
    const foundEvidence = [];

    evidenceIndicators.forEach(indicator => {
        if (lowerText.includes(indicator)) {
            evidenceCount++;
            foundEvidence.push(indicator);
        }
    });

    // Check for quotes (often indicate sourcing)
    const quoteMatches = text.match(/[""].*?[""]|[''].*?['']/g) || [];
    const hasQuotes = quoteMatches.length > 0;

    // Check for numbers/statistics
    const hasStatistics = /\d+%|\d+\s*(percent|million|billion|thousand)/i.test(text);

    // Score calculation (25 points max)
    let score = 0;
    if (evidenceCount >= 3 || (evidenceCount >= 2 && (hasQuotes || hasStatistics))) {
        score = 25; // Strong evidence
    } else if (evidenceCount >= 1 || hasQuotes || hasStatistics) {
        score = 12; // Some evidence
    }

    let reason = null;
    if (score === 25) {
        reason = {
            type: 'positive',
            title: 'Evidence and Sources Present',
            description: 'The content cites sources, experts, or provides verifiable data points.'
        };
    } else if (score === 12) {
        reason = {
            type: 'info',
            title: 'Limited Evidence Present',
            description: 'Some references to sources or data exist, but verification is recommended.'
        };
    } else {
        reason = {
            type: 'warning',
            title: 'No Clear Evidence or Sources',
            description: 'The content does not cite specific sources, studies, or official statements.'
        };
    }

    return {
        evidenceCount,
        foundEvidence: foundEvidence.slice(0, 5),
        hasQuotes,
        hasStatistics,
        score,
        reason
    };
}

/**
 * Full language analysis
 * @param {string} text - Text to analyze
 * @returns {Object} - Complete language analysis
 */
function analyzeLanguage(text) {
    const emotionalAnalysis = analyzeEmotionalTone(text);
    const sensationalismAnalysis = analyzeSensationalism(text);
    const evidenceAnalysis = analyzeEvidence(text);

    return {
        emotional: emotionalAnalysis,
        sensationalism: sensationalismAnalysis,
        evidence: evidenceAnalysis,
        totalLanguageScore: emotionalAnalysis.score + sensationalismAnalysis.score + evidenceAnalysis.score
    };
}

module.exports = {
    analyzeEmotionalTone,
    analyzeSensationalism,
    analyzeEvidence,
    analyzeLanguage
};
