/**
 * Fake News Credibility Assistant - Backend Server
 * 
 * Express.js server providing credibility analysis API
 * Uses rule-based analysis for transparent, explainable results
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { analyzeCredibility } = require('./analyzers/scoringEngine');
const { isValidUrl, fetchUrlContent, combineForAnalysis } = require('./analyzers/urlExtractor');
const { analyzeArticleImages } = require('./analyzers/imageAnalyzer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS configuration - allow all origins for production
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',  // Allow all origins, or set FRONTEND_URL in env
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        error: 'Too many requests',
        message: 'You have exceeded the rate limit of 100 requests per 15 minutes. Please try again later.'
    }
});

// Apply rate limiter to all routes
app.use(limiter);

app.use(express.json({ limit: '50kb' })); // Limit payload size

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Fake News Credibility Assistant API',
        version: '1.2.0',
        features: ['text-analysis', 'url-fetching', 'date-detection', 'image-verification']
    });
});

/**
 * Streaming analysis endpoint
 * POST /analyze-stream
 * Body: { "text": "content to analyze" }
 */
app.post('/analyze-stream', async (req, res) => {
    try {
        const { text } = req.body;

        // Same validation as main endpoint
        if (!text || typeof text !== 'string' || text.trim().length < 10) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Please provide valid text content to analyze (minimum 10 characters).'
            });
        }

        const trimmedText = text.trim();

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendUpdate = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        let contentToAnalyze = trimmedText;
        let urlData = null;

        // URL detection logic (simplified for the stream start)
        if (isValidUrl(trimmedText)) {
            sendUpdate({ percent: 5, status: 'URL detected, fetching content...' });
            const extracted = await fetchUrlContent(trimmedText);
            if (extracted.success) {
                contentToAnalyze = combineForAnalysis(extracted);
                urlData = {
                    originalUrl: trimmedText,
                    fetchedTitle: extracted.title,
                    fetchedDescription: extracted.description,
                    publishedDate: extracted.publishedDate,
                    author: extracted.author,
                    wordCount: extracted.wordCount,
                    rawHtml: extracted.rawHtml
                };
            }
        }

        // Perform analysis with progress updates
        const result = await analyzeCredibility(contentToAnalyze, {
            publishedDate: urlData?.publishedDate,
            onProgress: (update) => {
                sendUpdate(update);
            }
        });

        // Add URL data if applicable
        if (urlData) {
            result.urlData = urlData;
            if (urlData.fetchedTitle) {
                result.fetchedContent = {
                    title: urlData.fetchedTitle,
                    description: urlData.fetchedDescription,
                    publishedDate: urlData.publishedDate,
                    author: urlData.author,
                    wordCount: urlData.wordCount
                };
            }
        }

        // Image analysis
        if (urlData && urlData.rawHtml) {
            sendUpdate({ percent: 95, status: 'Analyzing article images...' });
            try {
                const imageAnalysis = await analyzeArticleImages(urlData.rawHtml, urlData.originalUrl);
                result.imageAnalysis = imageAnalysis;
            } catch (imgError) {
                result.imageAnalysis = { enabled: false, error: imgError.message };
            }
        }

        // Send final result
        sendUpdate({ percent: 100, status: 'Complete', result });
        res.end();

    } catch (error) {
        console.error('Streaming analysis error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Analysis failed', message: error.message })}\n\n`);
        res.end();
    }
});

/**
 * Main analysis endpoint
 * POST /analyze
 * Body: { "text": "content to analyze" } or { "text": "https://example.com/article" }
 */
app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;

        // Validate input
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Please provide text content to analyze.'
            });
        }

        const trimmedText = text.trim();

        // Check text length
        if (trimmedText.length < 10) {
            return res.status(400).json({
                error: 'Content too short',
                message: 'Please provide more content for accurate analysis (minimum 10 characters).'
            });
        }

        if (trimmedText.length > 50000) {
            return res.status(400).json({
                error: 'Content too long',
                message: 'Content exceeds maximum length. Please provide content under 50,000 characters.'
            });
        }

        let contentToAnalyze = trimmedText;
        let urlData = null;

        // Check if input looks like just a domain (no real content)
        const isDomainOnly = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?\/?$/i.test(trimmedText);

        // Check if input is a URL
        if (isValidUrl(trimmedText)) {
            console.log(`[${new Date().toISOString()}] URL detected, fetching content...`);

            const extracted = await fetchUrlContent(trimmedText);

            if (extracted.success) {
                console.log(`[${new Date().toISOString()}] Content extracted: ${extracted.wordCount} words from "${extracted.title.substring(0, 50)}..."`);

                // Combine extracted content for analysis
                contentToAnalyze = combineForAnalysis(extracted);

                urlData = {
                    originalUrl: trimmedText,
                    fetchedTitle: extracted.title,
                    fetchedDescription: extracted.description,
                    publishedDate: extracted.publishedDate,
                    author: extracted.author,
                    wordCount: extracted.wordCount,
                    rawHtml: extracted.rawHtml // For image analysis
                };
            } else {
                console.log(`[${new Date().toISOString()}] URL fetch failed: ${extracted.error}`);

                // If it's just a domain and fetch failed, we can't analyze
                if (isDomainOnly) {
                    return res.status(400).json({
                        error: 'Cannot analyze domain only',
                        message: 'We could not fetch content from this URL. Please paste the article text directly, or provide a full article URL.',
                        suggestion: extracted.suggestion || 'Try copying and pasting the article text instead.'
                    });
                }

                // Still analyze the URL itself (domain check will work)
                urlData = {
                    originalUrl: trimmedText,
                    fetchError: extracted.error
                };
            }
        } else if (isDomainOnly) {
            // User entered just a domain without http/https
            return res.status(400).json({
                error: 'Cannot analyze domain only',
                message: 'Please provide actual article content to analyze, not just a website domain.',
                suggestion: 'Paste the full article text or a complete article URL.'
            });
        }

        // Perform analysis
        console.log(`[${new Date().toISOString()}] Analyzing content (${contentToAnalyze.length} chars)`);

        // Pass publishedDate if we fetched it from URL
        const analysisOptions = {};
        if (urlData && urlData.publishedDate) {
            analysisOptions.publishedDate = urlData.publishedDate;
        }
        const result = await analyzeCredibility(contentToAnalyze, analysisOptions);

        // Add URL metadata to result if applicable
        if (urlData) {
            result.urlData = urlData;

            // If URL was fetched successfully, update the summary
            if (urlData.fetchedTitle && !urlData.fetchError) {
                result.fetchedContent = {
                    title: urlData.fetchedTitle,
                    description: urlData.fetchedDescription,
                    publishedDate: urlData.publishedDate,
                    author: urlData.author,
                    wordCount: urlData.wordCount
                };
            }
        }

        // Analyze images if we have raw HTML (runs in parallel with main analysis)
        let imageAnalysisPromise = null;
        if (urlData && urlData.rawHtml) {
            console.log(`[${new Date().toISOString()}] Starting image analysis...`);
            imageAnalysisPromise = analyzeArticleImages(urlData.rawHtml, urlData.originalUrl);
        }

        // Wait for image analysis if running
        if (imageAnalysisPromise) {
            try {
                const imageAnalysis = await imageAnalysisPromise;
                result.imageAnalysis = imageAnalysis;
                console.log(`[${new Date().toISOString()}] Image analysis complete: ${imageAnalysis.summary?.message || 'Done'}`);
            } catch (imgError) {
                console.error('[ImageAnalyzer] Error:', imgError.message);
                result.imageAnalysis = { enabled: false, error: imgError.message };
            }
        }

        // Log result summary
        console.log(`[${new Date().toISOString()}] Analysis complete: Score ${result.score} (${result.statusLabel})`);

        res.json(result);

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: 'An unexpected error occurred during analysis. Please try again.'
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist.'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Server error',
        message: 'An unexpected error occurred.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   Fake News Credibility Assistant - API Server         ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║   Server running on http://localhost:${PORT}              ║`);
    console.log('║   Endpoints:                                           ║');
    console.log('║     GET  /health  - Health check                       ║');
    console.log('║     POST /analyze - Analyze content or URL             ║');
    console.log('║   Features:                                            ║');
    console.log('║     ✓ URL content fetching                             ║');
    console.log('║     ✓ Date detection                                   ║');
    console.log('║     ✓ Domain analysis                                  ║');
    console.log('║     ✓ Reverse image search                             ║');
    console.log('╚════════════════════════════════════════════════════════╝');
});

module.exports = app;
