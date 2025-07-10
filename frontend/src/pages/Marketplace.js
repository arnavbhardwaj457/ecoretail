import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';

const Marketplace = () => {
  const { marketplaceItems, loading, error, fetchMarketplaceItems, addMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    material: {
      type: '',
      quantity: {
        value: '',
        unit: ''
      },
      condition: 'good'
    },
    location: {
      address: {
        city: '',
        country: ''
      }
    },
    contact: {
      name: '',
      email: ''
    },
    pricing: {
      type: 'free',
      amount: {
        value: 0,
        currency: 'USD'
      }
    },
    images: []
  });

  useEffect(() => {
    fetchMarketplaceItems();
  }, [fetchMarketplaceItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const result = await updateMarketplaceItem(editingItem._id, formData);
        if (result.success) {
          setEditingItem(null);
          setShowAddModal(false);
          resetForm();
        } else {
          alert(`Error updating item: ${result.error}`);
        }
      } else {
        const result = await addMarketplaceItem(formData);
        if (result.success) {
          setShowAddModal(false);
          resetForm();
        } else {
          alert(`Error creating item: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error saving marketplace item:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      material: {
        type: item.material?.type || '',
        quantity: {
          value: item.material?.quantity?.value || '',
          unit: item.material?.quantity?.unit || ''
        },
        condition: item.material?.condition || 'good'
      },
      location: {
        address: {
          city: item.location?.address?.city || '',
          country: item.location?.address?.country || ''
        }
      },
      contact: {
        name: item.contact?.name || '',
        email: item.contact?.email || ''
      },
      pricing: {
        type: item.pricing?.type || 'free',
        amount: {
          value: item.pricing?.amount?.value || 0,
          currency: item.pricing?.amount?.currency || 'USD'
        }
      },
      images: item.images || []
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const result = await deleteMarketplaceItem(id);
        if (!result.success) {
          alert(`Error deleting item: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting marketplace item:', error);
        alert('An error occurred while deleting the item.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      material: {
        type: '',
        quantity: {
          value: '',
          unit: ''
        },
        condition: 'good'
      },
      location: {
        address: {
          city: '',
          country: ''
        }
      },
      contact: {
        name: '',
        email: ''
      },
      pricing: {
        type: 'free',
        amount: {
          value: 0,
          currency: 'USD'
        }
      },
      images: []
    });
  };

  const filteredItems = marketplaceItems
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'price') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const categories = [
    'Packaging Materials',
    'Raw Materials',
    'Electronics',
    'Textiles',
    'Plastics',
    'Metals',
    'Wood',
    'Other'
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent', color: 'bg-green-100 text-green-800' },
    { value: 'good', label: 'Good', color: 'bg-blue-100 text-blue-800' },
    { value: 'fair', label: 'Fair', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'poor', label: 'Poor', color: 'bg-red-100 text-red-800' }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Circular Economy Marketplace</h1>
          <p className="mt-2 text-gray-600">
            Connect with other businesses to reuse materials and reduce waste
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          List Material
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Trash2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{marketplaceItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">
                {marketplaceItems.filter(item => item.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <RefreshCw className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(marketplaceItems.map(item => item.category)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Filter className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Waste Diverted</p>
              <p className="text-2xl font-bold text-gray-900">
                {marketplaceItems.reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0).toFixed(1)} tons
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-600">{item.category}</span>
                    </div>
                                      <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <span className="ml-2 text-gray-600">{item.material?.quantity?.value} {item.material?.quantity?.unit}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">{item.location?.address?.city}, {item.location?.address?.country}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700">Price:</span>
                    <span className="ml-2 text-gray-600">
                      {item.pricing?.type === 'free' ? 'Free' : `$${item.pricing?.amount?.value}`}
                    </span>
                  </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conditions.find(c => c.value === item.material?.condition)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {conditions.find(c => c.value === item.material?.condition)?.label || item.material?.condition}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Trash2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'Get started by listing your first material.'
            }
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingItem ? 'Edit Material' : 'List New Material'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe the material, its condition, and any specific requirements..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material Type *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.material.type}
                        onChange={(e) => setFormData({
                          ...formData, 
                          material: {...formData.material, type: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Cardboard, Plastic, Metal"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.material.quantity.value}
                        onChange={(e) => setFormData({
                          ...formData, 
                          material: {
                            ...formData.material, 
                            quantity: {...formData.material.quantity, value: e.target.value}
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit *
                      </label>
                      <select
                        required
                        value={formData.material.quantity.unit}
                        onChange={(e) => setFormData({
                          ...formData, 
                          material: {
                            ...formData.material, 
                            quantity: {...formData.material.quantity, unit: e.target.value}
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select unit</option>
                        <option value="tons">Tons</option>
                        <option value="kg">Kilograms</option>
                        <option value="pieces">Pieces</option>
                        <option value="meters">Meters</option>
                        <option value="liters">Liters</option>
                        <option value="boxes">Boxes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition *
                      </label>
                      <select
                        required
                        value={formData.material.condition}
                        onChange={(e) => setFormData({
                          ...formData, 
                          material: {...formData.material, condition: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {conditions.map(condition => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pricing Type *
                      </label>
                      <select
                        required
                        value={formData.pricing.type}
                        onChange={(e) => setFormData({
                          ...formData, 
                          pricing: {...formData.pricing, type: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="free">Free</option>
                        <option value="negotiable">Negotiable</option>
                        <option value="fixed">Fixed Price</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location.address.city}
                        onChange={(e) => setFormData({
                          ...formData, 
                          location: {
                            ...formData.location, 
                            address: {...formData.location.address, city: e.target.value}
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location.address.country}
                        onChange={(e) => setFormData({
                          ...formData, 
                          location: {
                            ...formData.location, 
                            address: {...formData.location.address, country: e.target.value}
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contact.name}
                        onChange={(e) => setFormData({
                          ...formData, 
                          contact: {...formData.contact, name: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.contact.email}
                        onChange={(e) => setFormData({
                          ...formData, 
                          contact: {...formData.contact, email: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {formData.pricing.type === 'fixed' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.pricing.amount.value}
                        onChange={(e) => setFormData({
                          ...formData, 
                          pricing: {
                            ...formData.pricing, 
                            amount: {...formData.pricing.amount, value: parseFloat(e.target.value)}
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingItem ? 'Update Material' : 'List Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 