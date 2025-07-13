import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllData();
    }
  }, [isAuthenticated, user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSuppliers(),
        fetchLogistics(),
        fetchMarketplace(),
        fetchMarketplaceItems(),
        fetchAiSuggestions(),
        fetchAnalytics()
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/suppliers');
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const createSupplier = async (supplierData) => {
    try {
      const response = await axios.post('/api/suppliers', supplierData);
      setSuppliers(prev => [response.data.supplier, ...prev]);
      return { success: true, supplier: response.data.supplier };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create supplier';
      return { success: false, error: message };
    }
  };

  const updateSupplier = async (id, supplierData) => {
    try {
      const response = await axios.put(`/api/suppliers/${id}`, supplierData);
      setSuppliers(prev => prev.map(s => s._id === id ? response.data.supplier : s));
      return { success: true, supplier: response.data.supplier };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update supplier';
      return { success: false, error: message };
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await axios.delete(`/api/suppliers/${id}`);
      setSuppliers(prev => prev.filter(s => s._id !== id));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete supplier';
      return { success: false, error: message };
    }
  };

  // Logistics
  const fetchLogistics = async () => {
    try {
      const response = await axios.get('/api/logistics');
      setLogistics(response.data.routes);
    } catch (error) {
      console.error('Failed to fetch logistics:', error);
    }
  };

  const createLogistics = async (logisticsData) => {
    try {
      const response = await axios.post('/api/logistics', logisticsData);
      setLogistics(prev => [response.data.route, ...prev]);
      return { success: true, route: response.data.route };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create logistics route';
      return { success: false, error: message };
    }
  };

  const updateLogistics = async (id, logisticsData) => {
    try {
      const response = await axios.put(`/api/logistics/${id}`, logisticsData);
      setLogistics(prev => prev.map(r => r._id === id ? response.data.route : r));
      return { success: true, route: response.data.route };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update logistics route';
      return { success: false, error: message };
    }
  };

  const deleteLogistics = async (id) => {
    try {
      await axios.delete(`/api/logistics/${id}`);
      setLogistics(prev => prev.filter(r => r._id !== id));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete logistics route';
      return { success: false, error: message };
    }
  };

  // Marketplace
  const fetchMarketplace = async () => {
    try {
      const response = await axios.get('/api/marketplace/user/listings');
      setMarketplace(response.data.listings);
    } catch (error) {
      console.error('Failed to fetch marketplace:', error);
    }
  };

  const fetchMarketplaceItems = async () => {
    try {
      const response = await axios.get('/api/marketplace');
      setMarketplaceItems(response.data.listings);
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
    }
  };

  const createMarketplaceListing = async (listingData) => {
    try {
      const response = await axios.post('/api/marketplace', listingData);
      setMarketplace(prev => [response.data.listing, ...prev]);
      setMarketplaceItems(prev => [response.data.listing, ...prev]);
      return { success: true, listing: response.data.listing };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create marketplace listing';
      return { success: false, error: message };
    }
  };

  const updateMarketplaceListing = async (id, listingData) => {
    try {
      const response = await axios.put(`/api/marketplace/${id}`, listingData);
      setMarketplace(prev => prev.map(l => l._id === id ? response.data.listing : l));
      setMarketplaceItems(prev => prev.map(l => l._id === id ? response.data.listing : l));
      return { success: true, listing: response.data.listing };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update marketplace listing';
      return { success: false, error: message };
    }
  };

  const deleteMarketplaceListing = async (id) => {
    try {
      await axios.delete(`/api/marketplace/${id}`);
      setMarketplace(prev => prev.filter(l => l._id !== id));
      setMarketplaceItems(prev => prev.filter(l => l._id !== id));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete marketplace listing';
      return { success: false, error: message };
    }
  };

  // AI Suggestions
  const fetchAiSuggestions = async () => {
    try {
      const response = await axios.get('/api/ai-suggestions/personalized');
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
    }
  };

  const markSuggestionAsImplemented = async (id) => {
    try {
      const response = await axios.put(`/api/ai-suggestions/${id}/implement`);
      setAiSuggestions(prev => prev.map(s => s._id === id ? response.data.suggestion : s));
      return { success: true, suggestion: response.data.suggestion };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to mark suggestion as implemented';
      return { success: false, error: message };
    }
  };

  const markSuggestionAsRejected = async (id) => {
    try {
      const response = await axios.put(`/api/ai-suggestions/${id}/reject`);
      setAiSuggestions(prev => prev.map(s => s._id === id ? response.data.suggestion : s));
      return { success: true, suggestion: response.data.suggestion };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to reject suggestion';
      return { success: false, error: message };
    }
  };

  const generateNewSuggestions = async () => {
    try {
      const response = await axios.post('/api/ai-suggestions/generate');
      setAiSuggestions(prev => [...response.data.suggestions, ...prev]);
      return { success: true, suggestions: response.data.suggestions };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to generate new suggestions';
      return { success: false, error: message };
    }
  };

  // Analytics
  const fetchAnalytics = async () => {
    try {
      const [supplierAnalytics, logisticsAnalytics, marketplaceAnalytics] = await Promise.all([
        axios.get('/api/suppliers/analytics/sustainability'),
        axios.get('/api/logistics/analytics/emissions'),
        axios.get('/api/marketplace/analytics/impact')
      ]);

      setAnalytics({
        suppliers: supplierAnalytics.data.analytics,
        logistics: logisticsAnalytics.data.analytics,
        marketplace: marketplaceAnalytics.data.analytics
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // Data
    suppliers,
    logistics,
    marketplace,
    marketplaceItems,
    aiSuggestions,
    analytics,
    
    // State
    loading,
    error,
    
    // Actions
    fetchAllData,
    clearError,
    
    // Suppliers
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    
    // Logistics
    fetchLogistics,
    createLogistics,
    updateLogistics,
    deleteLogistics,
    
    // Marketplace
    fetchMarketplace,
    fetchMarketplaceItems,
    createMarketplaceListing,
    updateMarketplaceListing,
    deleteMarketplaceListing,
    addMarketplaceItem: createMarketplaceListing,
    updateMarketplaceItem: updateMarketplaceListing,
    deleteMarketplaceItem: deleteMarketplaceListing,
    
    // AI Suggestions
    fetchAiSuggestions,
    markSuggestionAsImplemented,
    markSuggestionAsRejected,
    generateNewSuggestions,
    
    // Analytics
    fetchAnalytics
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 