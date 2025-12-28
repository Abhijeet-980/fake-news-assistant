/**
 * Fake News Credibility Assistant - Backend Server
 * 
 * Express.js server providing credibility analysis API
 * Uses rule-based analysis for transparent, explainable results
 */

const express = require('express');
const cors = require('cors');
const { analyzeCredibility } = require('./analyzers/scoringEngine');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json({ limit: '50kb' })); // Limit payload size

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Fake News Credibility Assistant API',
        version: '1.0.0'
    });
});

/**
 * Main analysis endpoint
 * POST /analyze
 * Body: { "text": "content to analyze" }
 */
app.post('/analyze', (req, res) => {
    try {
        const { text } = req.body;

        // Validate input
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Please provide text content to analyze.'
            });
        }

        // Check text length
        if (text.trim().length < 10) {
            return res.status(400).json({
                error: 'Content too short',
                message: 'Please provide more content for accurate analysis (minimum 10 characters).'
            });
        }

        if (text.length > 50000) {
            return res.status(400).json({
                error: 'Content too long',
                message: 'Content exceeds maximum length. Please provide content under 50,000 characters.'
            });
        }

        // Perform analysis
        console.log(`[${new Date().toISOString()}] Analyzing content (${text.length} chars)`);
        const result = analyzeCredibility(text);

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
    console.log('║     POST /analyze - Analyze content credibility        ║');
    console.log('╚════════════════════════════════════════════════════════╝');
});

module.exports = app;
