import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ArchitecturePage from './pages/ArchitecturePage';
import AboutPage from './pages/AboutPage';
import DumpGeneratorPage from './pages/DumpGeneratorPage';
import ThreatFeedPage from './pages/ThreatFeedPage';
import HistoryPage from './pages/HistoryPage';
import LogsPage from './pages/LogsPage';
import './index.css';

export const AppContext = React.createContext();

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  
  const [scanHistory, setScanHistory] = useState(() => {
     try {
         const stored = localStorage.getItem('ammamScanHistory');
         return stored ? JSON.parse(stored) : [];
     } catch (e) {
         return [];
     }
  });

  const startAnalysis = async (file) => {
      setIsAnalyzing(true);
      if (file) setCurrentFile(file);
      
      try {
          const formData = new FormData();
          if (file) {
              formData.append('file', file);
          } else if (currentFile) {
               formData.append('file', currentFile);
          }

          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
          const response = await fetch(`${apiUrl}/api/analyze`, {
              method: 'POST',
              body: formData,
          });
          const data = await response.json();
          // Add local timestamp reference for the frontend to calculate relative times
          data.scanTimestamp = Date.now();
          data.scanId = `SCN-${Math.floor(Math.random() * 9000) + 1000}`; // Generate a random SCN ID to track it
          setAnalysisResult(data);
          
          const updatedHistory = [...scanHistory, data];
          setScanHistory(updatedHistory);
          localStorage.setItem('ammamScanHistory', JSON.stringify(updatedHistory));
      } catch (error) {
          console.error('Analysis failed', error);
          alert('Failed to connect to backend server. Ensure Spring Boot is running on port 8080.');
      } finally {
          setIsAnalyzing(false);
      }
  };

  const resetAnalysis = () => {
      setAnalysisResult(null);
      setCurrentFile(null);
  };

  const contextValue = {
      analysisResult,
      isAnalyzing,
      currentFile,
      scanHistory,
      startAnalysis,
      resetAnalysis
  };

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="threats" element={<ThreatFeedPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="generator" element={<DumpGeneratorPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
