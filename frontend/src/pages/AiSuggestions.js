import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Lightbulb, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Star,
  MessageCircle,
  Bookmark,
  Clock
} from 'lucide-react';

const AiSuggestions = () => {
  const {
    aiSuggestions,
    loading,
    fetchAiSuggestions,
    markSuggestionAsImplemented,
    markSuggestionAsRejected,
    generateNewSuggestions
  } = useData();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showImplemented, setShowImplemented] = useState(true);
  const [showRejected, setShowRejected] = useState(false);

  useEffect(() => {
    fetchAiSuggestions();
  }, [fetchAiSuggestions]);

  const categories = [
    'Waste Reduction', 'Energy Efficiency', 'Supply Chain', 'Packaging',
    'Transportation', 'Water Conservation', 'Employee Training', 'Technology'
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'bg-red-200 text-red-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-200 text-yellow-800' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-200 text-green-800' }
  ];

  const filteredSuggestions = aiSuggestions
    .filter(s => selectedCategory === 'all' || s.category === selectedCategory)
    .filter(s => selectedPriority === 'all' || s.priority === selectedPriority)
    .filter(s => (s.status === 'implemented' && showImplemented) || 
                 (s.status === 'rejected' && showRejected) || 
                 s.status === 'pending')
    .sort((a, b) => {
      const order = { high: 3, medium: 2, low: 1 };
      return (order[b.priority] || 0) - (order[a.priority] || 0);
    });

  const handleImplement = async (id) => {
    await markSuggestionAsImplemented(id);
  };

  const handleReject = async (id) => {
    await markSuggestionAsRejected(id);
  };

  const handleGenerateNew = async () => {
    await generateNewSuggestions();
  };

  const getImpactScore = (s) => {
    const sum = (s.costSavings || 0) + (s.emissionsReduction || 0) + (s.wasteReduction || 0) + (s.implementationEase || 0);
    return Math.round((sum / 4) * 10) / 10;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-pulse">
        <div className="rounded-full h-16 w-16 border-4 border-t-4 border-green-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">🌱 AI Suggestions</h1>
          <p className="mt-1 text-gray-100">
            Personalized, actionable insights for a more sustainable future
          </p>
        </div>
        <button
          onClick={handleGenerateNew}
          className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold transition-transform transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="mr-2 h-5 w-5" /> Generate New
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Suggestions', count: aiSuggestions.length, icon: <Lightbulb />, color: 'bg-blue-50' },
          { label: 'Implemented', count: aiSuggestions.filter(s => s.status === 'implemented').length, icon: <CheckCircle />, color: 'bg-green-50' },
          { label: 'High Priority', count: aiSuggestions.filter(s => s.priority === 'high').length, icon: <Star />, color: 'bg-yellow-50' },
          { label: 'Categories', count: new Set(aiSuggestions.map(s => s.category)).size, icon: <MessageCircle />, color: 'bg-purple-50' }
        ].map(({ label, count, icon, color }, idx) => (
          <div
            key={label}
            className={`glass ${color} border border-eco-green/10 shadow-glass rounded-xl transition-all transition-colors duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/20 animate-fade-in flex items-center p-4`}
          >
            <div className={`p-2 rounded-lg bg-white shadow-sm mr-4 transition-colors duration-300`}>{icon}</div>
            <div>
              <div className="text-sm font-medium text-gray-100 transition-colors duration-300">{label}</div>
              <div className="text-2xl font-bold text-gray-200 transition-colors duration-300">{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="bg-white rounded-lg shadow-lg p-6 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">💡 Suggestions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSuggestions.map((suggestion) => (
                <tr key={suggestion.id} className="transition-colors duration-300 hover:bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{suggestion.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{suggestion.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {suggestion.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
                      suggestion.status === 'implemented' ? 'bg-green-100 text-green-800' :
                      suggestion.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {suggestion.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getImpactScore(suggestion)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {suggestion.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleImplement(suggestion.id)}
                          className="text-green-600 hover:text-green-900 mr-3 transition-colors duration-300"
                          title="Implement"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(suggestion.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          title="Reject"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {suggestion.status === 'implemented' && (
                      <span className="text-green-600">Implemented</span>
                    )}
                    {suggestion.status === 'rejected' && (
                      <span className="text-red-600">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AiSuggestions;
