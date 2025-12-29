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
import AboutPage from './pages/AboutPage';
import MethodologyPage from './pages/MethodologyPage';
import PrivacyPage from './pages/PrivacyPage';
import { ResultsSkeleton } from './components/SkeletonLoader';
import './index.css';

// API configuration
// API URL - use environment variable in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  // Page state: 'landing', 'analyzing', 'results', 'about', 'methodology', 'privacy'
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

      // Show skeleton loading briefly before showing results
      setCurrentPage('loading');
      await new Promise(resolve => setTimeout(resolve, 800));

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

  /**
   * Navigate to a specific page
   */
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Render current page
  switch (currentPage) {
    case 'analyzing':
      return <AnalyzingPage onCancel={handleCancel} />;

    case 'loading':
      return <ResultsSkeleton />;

    case 'results':
      return (
        <ResultsPage
          result={analysisResult}
          inputText={inputText}
          onNewAnalysis={handleNewAnalysis}
        />
      );

    case 'about':
      return <AboutPage onBack={() => navigateTo('landing')} />;

    case 'methodology':
      return <MethodologyPage onBack={() => navigateTo('landing')} />;

    case 'privacy':
      return <PrivacyPage onBack={() => navigateTo('landing')} />;

    case 'landing':
    default:
      return <LandingPage onAnalyze={handleAnalyze} onNavigate={navigateTo} />;
  }
}

export default App;

