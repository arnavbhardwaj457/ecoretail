import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Lightbulb, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Star,
  Bookmark,
  MessageCircle,
  Clock
} from 'lucide-react';

const AiSuggestions = () => {
  const { aiSuggestions, loading, error, fetchAiSuggestions, markSuggestionAsImplemented, markSuggestionAsRejected, generateNewSuggestions } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showImplemented, setShowImplemented] = useState(true);
  const [showRejected, setShowRejected] = useState(false);

  useEffect(() => {
    fetchAiSuggestions();
  }, [fetchAiSuggestions]);

  const categories = [
    'Waste Reduction',
    'Energy Efficiency',
    'Supply Chain',
    'Packaging',
    'Transportation',
    'Water Conservation',
    'Employee Training',
    'Technology'
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800 border-green-200' }
  ];

  const filteredSuggestions = aiSuggestions
    .filter(suggestion => selectedCategory === 'all' || suggestion.category === selectedCategory)
    .filter(suggestion => selectedPriority === 'all' || suggestion.priority === selectedPriority)
    .filter(suggestion => {
      if (suggestion.status === 'implemented') return showImplemented;
      if (suggestion.status === 'rejected') return showRejected;
      return true;
    })
    .sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handleImplement = async (id) => {
    try {
      await markSuggestionAsImplemented(id);
    } catch (error) {
      console.error('Error marking suggestion as implemented:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await markSuggestionAsRejected(id);
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
    }
  };

  const handleGenerateNew = async () => {
    try {
      await generateNewSuggestions();
    } catch (error) {
      console.error('Error generating new suggestions:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getImpactScore = (suggestion) => {
    const factors = {
      costSavings: suggestion.costSavings || 0,
      emissionsReduction: suggestion.emissionsReduction || 0,
      wasteReduction: suggestion.wasteReduction || 0,
      implementationEase: suggestion.implementationEase || 0
    };
    
    const total = Object.values(factors).reduce((sum, value) => sum + value, 0);
    return Math.round((total / 4) * 10) / 10;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Waste Reduction Suggestions</h1>
          <p className="mt-2 text-gray-600">
            Personalized AI-powered recommendations to help reduce waste and improve sustainability
          </p>
        </div>
        <button
          onClick={handleGenerateNew}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Generate New Suggestions
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">{aiSuggestions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Implemented</p>
              <p className="text-2xl font-bold text-gray-900">
                {aiSuggestions.filter(s => s.status === 'implemented').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {aiSuggestions.filter(s => s.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(aiSuggestions.map(s => s.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showImplemented}
                onChange={(e) => setShowImplemented(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show Implemented</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showRejected}
                onChange={(e) => setShowRejected(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show Rejected</span>
            </label>
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuggestions.map((suggestion) => (
          <div 
            key={suggestion._id} 
            className={`rounded-lg shadow-sm border overflow-hidden transition-shadow hover:shadow-md ${getStatusColor(suggestion.status)}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getStatusIcon(suggestion.status)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600">{suggestion.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  priorities.find(p => p.value === suggestion.priority)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {priorities.find(p => p.value === suggestion.priority)?.label || suggestion.priority}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{suggestion.description}</p>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    ${suggestion.costSavings?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-600">Annual Savings</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {suggestion.emissionsReduction?.toFixed(1) || 0} tons
                  </p>
                  <p className="text-xs text-gray-600">CO₂ Reduction</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {suggestion.wasteReduction?.toFixed(1) || 0} tons
                  </p>
                  <p className="text-xs text-gray-600">Waste Reduction</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {getImpactScore(suggestion)}/10
                  </p>
                  <p className="text-xs text-gray-600">Impact Score</p>
                </div>
              </div>

              {/* Implementation Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Implementation Time: {suggestion.implementationTime || '3-6 months'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Bookmark className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Difficulty: {suggestion.implementationEase || 'Medium'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {suggestion.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleImplement(suggestion._id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1 inline" />
                    Implement
                  </button>
                  <button
                    onClick={() => handleReject(suggestion._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <XCircle className="h-4 w-4 mr-1 inline" />
                    Reject
                  </button>
                </div>
              )}

              {suggestion.status === 'implemented' && (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Implemented
                  </span>
                </div>
              )}

              {suggestion.status === 'rejected' && (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejected
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCategory !== 'all' || selectedPriority !== 'all' 
              ? 'Try adjusting your filters.'
              : 'Generate new AI suggestions to get started.'
            }
          </p>
          <button
            onClick={handleGenerateNew}
            className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Generate Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default AiSuggestions; 