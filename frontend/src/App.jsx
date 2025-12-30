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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');

  /**
   * Handle analyze request
   * @param {string} text - Text or URL to analyze
   */
  const handleAnalyze = async (text) => {
    setInputText(text);
    setError(null);
    setAnalysisProgress(0);
    setAnalysisStatus('Connecting to server...');
    setCurrentPage('analyzing');

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-stream`, {
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep the last incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              throw new Error(data.message || 'Streaming failed');
            }

            if (data.result) {
              // We got the final result
              setAnalysisResult(data.result);
              setAnalysisProgress(100);
              setAnalysisStatus('Analysis complete!');

              // Move to results page after a short delay for "completion feel"
              setTimeout(() => {
                setCurrentPage('results');
              }, 600);
              return;
            }

            if (data.percent !== undefined) {
              setAnalysisProgress(data.percent);
            }
            if (data.status) {
              setAnalysisStatus(data.status);
            }
          }
        }
      }

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
      setCurrentPage('landing');
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
      return (
        <AnalyzingPage
          onCancel={handleCancel}
          progress={analysisProgress}
          statusText={analysisStatus}
        />
      );

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

