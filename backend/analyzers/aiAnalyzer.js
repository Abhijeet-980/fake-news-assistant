/**
 * AI Analyzer Module
 * Uses Google Gemini AI to classify content and detect misinformation
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini API configuration - loaded from .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Classification categories
const CLASSIFICATION = {
    REAL_NEWS: 'real_news',
    SATIRE: 'satire',
    FICTION: 'fiction',
    MISLEADING: 'misleading',
    OPINION: 'opinion',
    PROPAGANDA: 'propaganda',
    UNVERIFIABLE: 'unverifiable'
};

// Score adjustments based on AI classification
const CLASSIFICATION_SCORES = {
    [CLASSIFICATION.REAL_NEWS]: 15,
    [CLASSIFICATION.SATIRE]: -45,
    [CLASSIFICATION.FICTION]: -50,
    [CLASSIFICATION.MISLEADING]: -35,
    [CLASSIFICATION.OPINION]: -10,
    [CLASSIFICATION.PROPAGANDA]: -40,
    [CLASSIFICATION.UNVERIFIABLE]: -15
};

/**
 * Sleep helper function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make a single API call attempt
 */
async function makeApiCall(genAI, modelName, prompt) {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

/**
 * Analyze content using Gemini AI with retry logic
 * @param {string} text - Content to analyze
 * @returns {Promise<Object>} - AI analysis result
 */
async function analyzeWithAI(text) {
    if (!GEMINI_API_KEY) {
        return { success: false, enabled: false, error: 'No API key configured' };
    }

    const prompt = `You are a fact-checking AI assistant. Analyze the following content and provide a credibility assessment.

CONTENT TO ANALYZE:
"""
${text.substring(0, 3000)}
"""

Analyze this content and respond in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):
{
    "classification": "ONE OF: real_news, satire, fiction, misleading, opinion, propaganda, unverifiable",
    "confidence": 0.0 to 1.0,
    "reasoning": "Brief explanation (2-3 sentences)",
    "red_flags": ["list of specific issues found"],
    "fictional_elements": ["list of obviously fictional elements if any"],
    "recommendation": "Brief advice for the reader"
}

CLASSIFICATION GUIDE:
- real_news: Appears to be legitimate journalism with verifiable facts
- satire: Intentionally humorous or satirical content (like The Onion)
- fiction: Made-up story presented as news
- misleading: Contains factual errors or misleading framing
- opinion: Opinion piece disguised as objective news
- propaganda: One-sided content pushing a specific agenda
- unverifiable: Claims that cannot be verified with available information

Be critical. Look for:
- Impossible or absurd claims (animals in government positions, time travel, etc.)
- Made-up locations, people, or organizations
- Statistics without sources
- Quotes from unverifiable sources
- Satirical tone or humor disguised as news

Respond with ONLY the JSON, no other text.`;

    // Models to try in order (best first, with fallbacks)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    for (const modelName of modelsToTry) {
        try {
            console.log(`[AI Analyzer] Trying model: ${modelName}`);
            const responseText = await makeApiCall(genAI, modelName, prompt);

            // Parse JSON response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('[AI Analyzer] No JSON found in response');
                continue;
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Validate classification
            const validClassifications = Object.values(CLASSIFICATION);
            if (!validClassifications.includes(parsed.classification)) {
                parsed.classification = CLASSIFICATION.UNVERIFIABLE;
            }

            const scoreAdjustment = CLASSIFICATION_SCORES[parsed.classification] || 0;
            console.log(`[AI Analyzer] Classification: ${parsed.classification} (confidence: ${parsed.confidence})`);

            return {
                success: true,
                enabled: true,
                classification: parsed.classification,
                classificationLabel: formatClassificationLabel(parsed.classification),
                confidence: parsed.confidence || 0.5,
                reasoning: parsed.reasoning || 'Analysis completed',
                redFlags: parsed.red_flags || [],
                fictionalElements: parsed.fictional_elements || [],
                recommendation: parsed.recommendation || 'Verify with trusted sources',
                scoreAdjustment: scoreAdjustment
            };

        } catch (error) {
            console.log(`[AI Analyzer] Model ${modelName} failed: ${error.message.substring(0, 100)}`);

            // If rate limited, wait a bit before trying next model
            if (error.message.includes('retry')) {
                await sleep(2000);
            }
            continue;
        }
    }

    // All models failed
    console.error('[AI Analyzer] All models failed');
    return { success: false, enabled: true, error: 'All AI models failed' };
}

/**
 * Format classification label for display
 */
function formatClassificationLabel(classification) {
    const labels = {
        [CLASSIFICATION.REAL_NEWS]: 'Likely Real News',
        [CLASSIFICATION.SATIRE]: 'Satire/Parody',
        [CLASSIFICATION.FICTION]: 'Fictional Content',
        [CLASSIFICATION.MISLEADING]: 'Potentially Misleading',
        [CLASSIFICATION.OPINION]: 'Opinion Piece',
        [CLASSIFICATION.PROPAGANDA]: 'Propaganda/Biased',
        [CLASSIFICATION.UNVERIFIABLE]: 'Unverifiable Claims'
    };
    return labels[classification] || 'Unknown';
}

/**
 * Get classification color for UI
 */
function getClassificationColor(classification) {
    const colors = {
        [CLASSIFICATION.REAL_NEWS]: '#22c55e',
        [CLASSIFICATION.SATIRE]: '#f97316',
        [CLASSIFICATION.FICTION]: '#ef4444',
        [CLASSIFICATION.MISLEADING]: '#eab308',
        [CLASSIFICATION.OPINION]: '#3b82f6',
        [CLASSIFICATION.PROPAGANDA]: '#dc2626',
        [CLASSIFICATION.UNVERIFIABLE]: '#6b7280'
    };
    return colors[classification] || '#6b7280';
}

/**
 * Get classification icon for UI
 */
function getClassificationIcon(classification) {
    const icons = {
        [CLASSIFICATION.REAL_NEWS]: 'verified',
        [CLASSIFICATION.SATIRE]: 'sentiment_very_satisfied',
        [CLASSIFICATION.FICTION]: 'auto_stories',
        [CLASSIFICATION.MISLEADING]: 'warning',
        [CLASSIFICATION.OPINION]: 'chat',
        [CLASSIFICATION.PROPAGANDA]: 'campaign',
        [CLASSIFICATION.UNVERIFIABLE]: 'help'
    };
    return icons[classification] || 'help';
}

module.exports = {
    analyzeWithAI,
    formatClassificationLabel,
    getClassificationColor,
    getClassificationIcon,
    CLASSIFICATION,
    CLASSIFICATION_SCORES
};
