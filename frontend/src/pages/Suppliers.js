import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Users, Plus, Search, Filter, Edit, Trash2, Award, TrendingUp } from 'lucide-react';

const Suppliers = () => {
  const { suppliers, createSupplier, updateSupplier, deleteSupplier, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: {
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    category: 'raw_materials',
    sustainabilityMetrics: {
      carbonFootprint: { value: 0, unit: 'kg CO2e' },
      waterUsage: { value: 0, unit: 'liters' },
      wasteGenerated: { value: 0, unit: 'kg' },
      renewableEnergy: { percentage: 0 }
    },
    practices: {
      fairTrade: false,
      organic: false,
      localSourcing: false,
      recycledMaterials: false,
      energyEfficient: false,
      wasteReduction: false
    },
    notes: ''
  });

  const categories = [
    { value: 'raw_materials', label: 'Raw Materials' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'food', label: 'Food' },
    { value: 'chemicals', label: 'Chemicals' },
    { value: 'other', label: 'Other' }
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSupplier) {
        const result = await updateSupplier(editingSupplier._id, formData);
        if (result.success) {
          setEditingSupplier(null);
          setShowForm(false);
          resetForm();
        } else {
          alert(`Error updating supplier: ${result.error}`);
        }
      } else {
        const result = await createSupplier(formData);
        if (result.success) {
          setShowForm(false);
          resetForm();
        } else {
          alert(`Error creating supplier: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error submitting supplier form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      contact: {
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      },
      category: 'raw_materials',
      sustainabilityMetrics: {
        carbonFootprint: { value: 0, unit: 'kg CO2e' },
        waterUsage: { value: 0, unit: 'liters' },
        wasteGenerated: { value: 0, unit: 'kg' },
        renewableEnergy: { percentage: 0 }
      },
      practices: {
        fairTrade: false,
        organic: false,
        localSourcing: false,
        recycledMaterials: false,
        energyEfficient: false,
        wasteReduction: false
      },
      notes: ''
    });
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      company: supplier.company,
      contact: supplier.contact,
      category: supplier.category,
      sustainabilityMetrics: supplier.sustainabilityMetrics,
      practices: supplier.practices,
      notes: supplier.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const result = await deleteSupplier(id);
        if (!result.success) {
          alert(`Error deleting supplier: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('An error occurred while deleting the supplier.');
      }
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || supplier.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const averageScore = suppliers.length > 0 
    ? Math.round(suppliers.reduce((sum, s) => sum + s.sustainabilityScore.overall, 0) / suppliers.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier sustainability tracking</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}/100</p>
            </div>
          </div>
        </div>
        
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Excellent (80+)</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.sustainabilityScore.overall >= 80).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <div className="flex items-center">
            <Filter className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(suppliers.map(s => s.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Supplier Form */}
      {showForm && (
        <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData, 
                    contact: {...formData.contact, email: e.target.value}
                  })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sustainability Practices
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.practices).map(([practice, value]) => (
                  <label key={practice} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setFormData({
                        ...formData,
                        practices: {...formData.practices, [practice]: e.target.checked}
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {practice.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSupplier(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Suppliers List */}
      <div className="glass bg-gradient-to-br from-eco-green/30 via-eco-green/10 to-eco-teal/20 border border-eco-green/30 shadow-glass rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:ring-2 hover:ring-eco-green/40 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Suppliers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sustainability Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {supplier.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`sustainability-score ${getSustainabilityScoreClass(supplier.sustainabilityScore.overall)}`}>
                      {supplier.sustainabilityScore.overall}/100 - {getSustainabilityScoreLabel(supplier.sustainabilityScore.overall)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No suppliers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers; 