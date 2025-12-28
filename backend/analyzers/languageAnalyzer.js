/**
 * Language Analyzer Module
 * Detects emotional tone, sensationalism, and evidence presence
 * IMPROVED: Stricter evidence validation to catch AI-generated fake content
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

// VAGUE evidence phrases (AI-generated content uses these without specifics)
const vagueEvidencePhrases = [
    'according to experts',
    'experts say',
    'scientists say',
    'researchers say',
    'sources say',
    'sources confirm',
    'officials say',
    'authorities say',
    'studies show',
    'research shows',
    'data shows',
    'reports indicate',
    'experts believe',
    'many believe',
    'some say',
    'it is believed',
    'it is reported',
    'according to sources',
    'insiders say',
    'witnesses claim'
];

// STRONG evidence indicators (specific, verifiable)
const strongEvidenceIndicators = [
    // Named organizations
    'according to the',  // "according to the WHO", "according to the report"
    'published in',      // journal/publication names
    'study by',          // specific study attribution
    'report by',
    'statement from',
    'announced by',
    'confirmed by',

    // Official sources
    'ministry of',
    'department of',
    'government of',
    'official website',
    'press release',
    'official statement',

    // Academic/scientific
    'peer-reviewed',
    'journal',
    'university',
    'institute',
    'research paper',
    'published study',

    // Specific attribution markers
    'said in an interview',
    'told reporters',
    'in a statement',
    'spokesperson for',
    'representative of',

    // Fact-checking
    'fact-check',
    'verified by',
    'debunked',
    'confirmed'
];

// AI-generated content red flags
const aiContentRedFlags = [
    'in conclusion',
    'it is important to note',
    'it is worth noting',
    'in summary',
    'to summarize',
    'in light of',
    'in the wake of',
    'moving forward',
    'at the end of the day',
    'all things considered',
    'be that as it may',
    'having said that',
    'on the other hand',
    'furthermore',
    'nevertheless',
    'notwithstanding'
];

/**
 * Count emotional words in text
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

    const emotionalDensity = totalWords > 0 ? (emotionalCount / totalWords) * 100 : 0;

    // Score calculation (25 points max)
    let score = 25;
    if (emotionalDensity > 5 || clickbaitCount >= 2) {
        score = 0;
    } else if (emotionalDensity > 2 || clickbaitCount >= 1) {
        score = 12;
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
 * Analyze sensationalism indicators
 */
function analyzeSensationalism(text) {
    const words = text.split(/\s+/);
    const totalWords = words.length;

    const capsWords = words.filter(word => {
        const cleaned = word.replace(/[^A-Za-z]/g, '');
        return cleaned.length >= 3 && cleaned === cleaned.toUpperCase();
    });

    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    const capsPercentage = totalWords > 0 ? (capsWords.length / totalWords) * 100 : 0;

    let score = 20;
    if (capsPercentage > 10 || exclamationCount > 5) {
        score = 0;
    } else if (capsPercentage > 5 || exclamationCount > 2) {
        score = 10;
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
 * IMPROVED: Analyze evidence presence with stricter validation
 * Now distinguishes between vague and specific sources
 */
function analyzeEvidence(text) {
    const lowerText = text.toLowerCase();

    // Count VAGUE evidence (generic phrases without specifics)
    let vagueEvidenceCount = 0;
    const foundVagueEvidence = [];

    vagueEvidencePhrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
            vagueEvidenceCount++;
            foundVagueEvidence.push(phrase);
        }
    });

    // Count STRONG evidence (specific, verifiable sources)
    let strongEvidenceCount = 0;
    const foundStrongEvidence = [];

    strongEvidenceIndicators.forEach(indicator => {
        if (lowerText.includes(indicator)) {
            strongEvidenceCount++;
            foundStrongEvidence.push(indicator);
        }
    });

    // Check for AI content red flags
    let aiRedFlagCount = 0;
    aiContentRedFlags.forEach(phrase => {
        if (lowerText.includes(phrase)) {
            aiRedFlagCount++;
        }
    });

    // Check for quotes (often indicate sourcing)
    const quoteMatches = text.match(/[""].*?[""]|[''].*?['']/g) || [];
    const hasQuotes = quoteMatches.length > 0;

    // Check for specific named entities (names, organizations)
    // Pattern: Capital letter followed by lowercase, indicating proper nouns
    const namedEntities = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const hasNamedSources = namedEntities.length >= 2;

    // Check for numbers/statistics
    const hasStatistics = /\d+%|\d+\s*(percent|million|billion|thousand)/i.test(text);

    // Check for URLs (indicates external sources)
    const hasUrls = /https?:\/\/[^\s]+/i.test(text);

    // STRICTER Score calculation (25 points max)
    let score = 0;
    let evidenceQuality = 'none';

    if (strongEvidenceCount >= 2 && (hasQuotes || hasNamedSources || hasUrls)) {
        // Strong: Specific sources with quotes/names/URLs
        score = 25;
        evidenceQuality = 'strong';
    } else if (strongEvidenceCount >= 1 && hasStatistics) {
        // Good: Some specific sources with data
        score = 18;
        evidenceQuality = 'good';
    } else if (vagueEvidenceCount >= 2 && hasQuotes && hasNamedSources) {
        // Moderate: Vague phrases but with supporting quotes/names
        score = 12;
        evidenceQuality = 'moderate';
    } else if (vagueEvidenceCount >= 1 || hasStatistics) {
        // Weak: Only vague phrases or just statistics
        score = 6;
        evidenceQuality = 'weak';
    }

    // Penalty for AI-generated content patterns
    if (aiRedFlagCount >= 3) {
        score = Math.max(0, score - 8);
    }

    // Generate reason
    let reason = null;
    if (evidenceQuality === 'strong') {
        reason = {
            type: 'positive',
            title: 'Strong Evidence Present',
            description: 'The content cites specific sources, named experts, or provides verifiable data points.'
        };
    } else if (evidenceQuality === 'good') {
        reason = {
            type: 'positive',
            title: 'Evidence and Sources Present',
            description: 'The content references specific sources with supporting data.'
        };
    } else if (evidenceQuality === 'moderate') {
        reason = {
            type: 'info',
            title: 'Limited Evidence Present',
            description: 'Some references to sources exist, but verification is recommended.'
        };
    } else if (evidenceQuality === 'weak') {
        reason = {
            type: 'warning',
            title: 'Vague or Unverifiable Sources',
            description: vagueEvidenceCount > 0
                ? `Uses vague phrases like "${foundVagueEvidence[0]}" without naming specific sources. This is a common pattern in misinformation.`
                : 'Limited evidence present. Verify claims independently.'
        };
    } else {
        reason = {
            type: 'negative',
            title: 'No Verifiable Sources',
            description: 'The content does not cite any specific, verifiable sources. Treat claims with skepticism.'
        };
    }

    return {
        strongEvidenceCount,
        vagueEvidenceCount,
        foundStrongEvidence: foundStrongEvidence.slice(0, 5),
        foundVagueEvidence: foundVagueEvidence.slice(0, 5),
        aiRedFlagCount,
        hasQuotes,
        hasStatistics,
        hasNamedSources,
        hasUrls,
        evidenceQuality,
        score,
        reason
    };
}

/**
 * Full language analysis
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
