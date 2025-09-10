import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import GlobalControls from './components/GlobalControls';
import HomePage from './pages/HomePage';
import FlowchartPage from './pages/FlowchartPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <GlobalControls />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flowchart" element={<FlowchartPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;