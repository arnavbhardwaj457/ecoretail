import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ChatbotWidget from './components/ChatbotWidget';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Logistics from './pages/Logistics';
import Marketplace from './pages/Marketplace';
import AiSuggestions from './pages/AiSuggestions';
import Profile from './pages/Profile';
import FreshnessPredictor from './pages/FreshnessPredictor';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen dark:bg-eco-bg bg-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="ai-suggestions" element={<AiSuggestions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="freshness-predictor" element={<FreshnessPredictor />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatbotWidget />
    </div>
  );
}

export default App; 