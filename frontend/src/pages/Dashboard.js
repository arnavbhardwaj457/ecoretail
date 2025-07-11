import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Leaf,
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  Store,
  Lightbulb,
  Award,
  Clock,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    suppliers, 
    logistics, 
    marketplace, 
    aiSuggestions, 
    analytics, 
    loading,
    fetchAllData 
  } = useData();

  useEffect(() => {
    fetchAllData();
  }, []);

  const getSustainabilityScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSustainabilityScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const getSustainabilityScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  // Calculate summary metrics
  const totalSuppliers = suppliers.length;
  const totalLogisticsRoutes = logistics.length;
  const totalMarketplaceListings = marketplace.length;
  const totalAiSuggestions = aiSuggestions.length;

  const averageSupplierScore = suppliers.length > 0 
    ? Math.round(suppliers.reduce((sum, s) => sum + s.sustainabilityScore.overall, 0) / suppliers.length)
    : 0;

  const totalEmissions = logistics.reduce((sum, route) => sum + (route.emissions.current.value || 0), 0);
  const totalEmissionsSaved = logistics.reduce((sum, route) => sum + (route.emissions.saved.value || 0), 0);

  const totalCarbonSaved = marketplace.reduce((sum, listing) => sum + (listing.sustainability.carbonSaved.value || 0), 0);
  const totalWasteDiverted = marketplace.reduce((sum, listing) => sum + (listing.sustainability.wasteDiverted.value || 0), 0);

  // Chart data
  const supplierScoreData = suppliers.map(supplier => ({
    name: supplier.name,
    score: supplier.sustainabilityScore.overall,
    environmental: supplier.sustainabilityScore.environmental,
    social: supplier.sustainabilityScore.social,
    governance: supplier.sustainabilityScore.governance
  }));

  const emissionsData = logistics.map(route => ({
    name: route.route.name,
    current: route.emissions.current.value,
    saved: route.emissions.saved.value,
    alternative: route.emissions.alternative.value
  }));

  const categoryData = suppliers.reduce((acc, supplier) => {
    acc[supplier.category] = (acc[supplier.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="eco-gradient rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Welcome back, {user?.profile?.firstName || user?.username}!
            </h1>
            <p className="text-gray-800 mt-1">
              Here's your sustainability overview for {user?.company?.name}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-lg font-semibold text-black">EcoRetail</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-100">Total Suppliers</p>
              <p className="text-2xl font-bold text-white">{totalSuppliers}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className={`sustainability-score ${getSustainabilityScoreClass(averageSupplierScore)}`}>
                {getSustainabilityScoreLabel(averageSupplierScore)}
              </span>
              <span className="ml-2 text-sm text-gray-400">
                Avg Score: {averageSupplierScore}/100
              </span>
            </div>
          </div>
        </div>

        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-100">Logistics Routes</p>
              <p className="text-2xl font-bold text-white">{totalLogisticsRoutes}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {totalEmissionsSaved > 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <span className="ml-2 text-sm text-gray-400">
                {totalEmissionsSaved > 0 ? '+' : ''}{totalEmissionsSaved.toFixed(1)} kg CO₂ saved
              </span>
            </div>
          </div>
        </div>

        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-100">Marketplace Listings</p>
              <p className="text-2xl font-bold text-white">{totalMarketplaceListings}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <Award className="h-4 w-4 text-green-600" />
              <span className="ml-2 text-sm text-gray-400">
                {totalCarbonSaved.toFixed(1)} kg CO₂ diverted
              </span>
            </div>
          </div>
        </div>

        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-100">AI Suggestions</p>
              <p className="text-2xl font-bold text-white">{totalAiSuggestions}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="ml-2 text-sm text-gray-400">
                Personalized recommendations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Sustainability Scores */}
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-2 p-2">Supplier Sustainability Scores</h2>
          <p className="text-gray-400 mb-4 text-sm p-2">Top 5 suppliers by overall sustainability score.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierScoreData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Categories */}
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-2 p-2">Supplier Categories</h2>
          <p className="text-gray-400 mb-4 text-sm">Distribution of your suppliers by category.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {pieData.map((entry, index) => (
              <span key={entry.name} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border" style={{ borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}>
                <span className="w-2 h-2 rounded-full mr-2 inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Emissions Tracking */}
      {logistics.length > 0 && (
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">Emissions Tracking</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="current" stackId="1" stroke="#ef4444" fill="#ef4444" />
                <Area type="monotone" dataKey="saved" stackId="1" stroke="#10b981" fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/suppliers')}
            className="flex items-center p-4 border border-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <Users className="h-6 w-6 text-primary-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-white">Add Supplier</p>
              <p className="text-sm text-gray-400">Track sustainability metrics</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/logistics')}
            className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Truck className="h-6 w-6 text-eco-blue mr-3" />
            <div className="text-left">
              <p className="font-medium text-white">Add Route</p>
              <p className="text-sm text-gray-400">Track emissions</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/marketplace')}
            className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Store className="h-6 w-6 text-eco-purple mr-3" />
            <div className="text-left">
              <p className="font-medium text-white">List Material</p>
              <p className="text-sm text-gray-400">Circular economy</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {suppliers.slice(0, 3).map((supplier) => (
            <div key={supplier._id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-white">{supplier.name}</p>
                  <p className="text-sm text-gray-400">Supplier added</p>
                </div>
              </div>
              <span className={`sustainability-score ${getSustainabilityScoreClass(supplier.sustainabilityScore.overall)}`}>
                {supplier.sustainabilityScore.overall}/100
              </span>
            </div>
          ))}
          
          {logistics.slice(0, 2).map((route) => (
            <div key={route._id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-eco-blue mr-3" />
                <div>
                  <p className="font-medium text-white">{route.route.name}</p>
                  <p className="text-sm text-gray-400">Route added</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">
                {route.emissions.current.value} kg CO₂
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 