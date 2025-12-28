/**
 * Fake News Credibility Assistant
 * Main App Component
 * 
 * Manages page state and API communication between frontend and backend
 */
import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AnalyzingPage from './pages/AnalyzingPage';
import ResultsPage from './pages/ResultsPage';
import './index.css';

// API configuration
const API_BASE_URL = 'http://localhost:3001';

function App() {
  // Page state: 'landing', 'analyzing', 'results'
  const [currentPage, setCurrentPage] = useState('landing');
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handle analyze request
   * @param {string} text - Text or URL to analyze
   */
  const handleAnalyze = async (text) => {
    setInputText(text);
    setError(null);
    setCurrentPage('analyzing');

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const result = await response.json();

      // Add a small delay to show the analyzing animation
      await new Promise(resolve => setTimeout(resolve, 2500));

      setAnalysisResult(result);
      setCurrentPage('results');

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
      setCurrentPage('landing');
      // You could show an error toast here
    }
  };

  /**
   * Handle cancel during analysis
   */
  const handleCancel = () => {
    setCurrentPage('landing');
    setInputText('');
    setAnalysisResult(null);
  };

  /**
   * Handle new analysis request
   */
  const handleNewAnalysis = () => {
    setCurrentPage('landing');
    setInputText('');
    setAnalysisResult(null);
  };

  // Render current page
  switch (currentPage) {
    case 'analyzing':
      return <AnalyzingPage onCancel={handleCancel} />;

    case 'results':
      return (
        <ResultsPage
          result={analysisResult}
          inputText={inputText}
          onNewAnalysis={handleNewAnalysis}
        />
      );

    case 'landing':
    default:
      return <LandingPage onAnalyze={handleAnalyze} />;
  }
}

export default App;
