import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Truck, Plus, Search, TrendingDown, MapPin, ArrowRight } from 'lucide-react';

const Logistics = () => {
  const { logistics, createLogistics, updateLogistics, deleteLogistics, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    route: {
      name: '',
      origin: { location: '' },
      destination: { location: '' },
      distance: { value: 0, unit: 'km' }
    },
    transport: {
      mode: 'truck',
      vehicleType: '',
      fuelType: 'diesel',
      capacity: { value: 0, unit: 'kg' }
    },
    emissions: {
      current: { value: 0, unit: 'kg CO2e' },
      alternative: { value: 0, unit: 'kg CO2e' },
      saved: { value: 0, unit: 'kg CO2e' }
    },
    costs: {
      current: { value: 0, currency: 'USD' },
      alternative: { value: 0, currency: 'USD' },
      savings: { value: 0, currency: 'USD' }
    },
    schedule: {
      frequency: 'weekly'
    }
  });

  const transportModes = [
    { value: 'truck', label: 'Truck' },
    { value: 'train', label: 'Train' },
    { value: 'ship', label: 'Ship' },
    { value: 'plane', label: 'Plane' },
    { value: 'electric_vehicle', label: 'Electric Vehicle' },
    { value: 'bicycle', label: 'Bicycle' },
    { value: 'walking', label: 'Walking' }
  ];

  const fuelTypes = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'biodiesel', label: 'Biodiesel' },
    { value: 'hydrogen', label: 'Hydrogen' },
    { value: 'none', label: 'None' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'on_demand', label: 'On Demand' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingRoute) {
        const result = await updateLogistics(editingRoute._id, formData);
        if (result.success) {
          setEditingRoute(null);
          setShowForm(false);
          resetForm();
        } else {
          alert(`Error updating route: ${result.error}`);
        }
      } else {
        const result = await createLogistics(formData);
        if (result.success) {
          setShowForm(false);
          resetForm();
        } else {
          alert(`Error creating route: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error submitting logistics form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      route: {
        name: '',
        origin: { location: '' },
        destination: { location: '' },
        distance: { value: 0, unit: 'km' }
      },
      transport: {
        mode: 'truck',
        vehicleType: '',
        fuelType: 'diesel',
        capacity: { value: 0, unit: 'kg' }
      },
      emissions: {
        current: { value: 0, unit: 'kg CO2e' },
        alternative: { value: 0, unit: 'kg CO2e' },
        saved: { value: 0, unit: 'kg CO2e' }
      },
      costs: {
        current: { value: 0, currency: 'USD' },
        alternative: { value: 0, currency: 'USD' },
        savings: { value: 0, currency: 'USD' }
      },
      schedule: {
        frequency: 'weekly'
      }
    });
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      route: route.route,
      transport: route.transport,
      emissions: route.emissions,
      costs: route.costs,
      schedule: route.schedule
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        const result = await deleteLogistics(id);
        if (!result.success) {
          alert(`Error deleting route: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting route:', error);
        alert('An error occurred while deleting the route.');
      }
    }
  };

  const filteredRoutes = logistics.filter(route => 
    route.route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.route.origin.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.route.destination.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmissions = logistics.reduce((sum, route) => sum + (route.emissions.current.value || 0), 0);
  const totalEmissionsSaved = logistics.reduce((sum, route) => sum + (route.emissions.saved.value || 0), 0);
  const totalCost = logistics.reduce((sum, route) => sum + (route.costs.current.value || 0), 0);
  const totalCostSaved = logistics.reduce((sum, route) => sum + (route.costs.savings.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistics</h1>
          <p className="text-gray-600">Track transport routes and emissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-eco-blue" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Routes</p>
              <p className="text-2xl font-bold text-gray-900">{logistics.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Emissions</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmissions.toFixed(1)} kg CO₂</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Emissions Saved</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmissionsSaved.toFixed(1)} kg CO₂</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">${totalCostSaved.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Route Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingRoute ? 'Edit Route' : 'Add New Route'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Name
                </label>
                <input
                  type="text"
                  value={formData.route.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    route: {...formData.route, name: e.target.value}
                  })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Mode
                </label>
                <select
                  value={formData.transport.mode}
                  onChange={(e) => setFormData({
                    ...formData,
                    transport: {...formData.transport, mode: e.target.value}
                  })}
                  className="input-field"
                >
                  {transportModes.map(mode => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  value={formData.route.origin.location}
                  onChange={(e) => setFormData({
                    ...formData,
                    route: {
                      ...formData.route,
                      origin: {...formData.route.origin, location: e.target.value}
                    }
                  })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={formData.route.destination.location}
                  onChange={(e) => setFormData({
                    ...formData,
                    route: {
                      ...formData.route,
                      destination: {...formData.route.destination, location: e.target.value}
                    }
                  })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={formData.route.distance.value}
                  onChange={(e) => setFormData({
                    ...formData,
                    route: {
                      ...formData.route,
                      distance: {...formData.route.distance, value: parseFloat(e.target.value)}
                    }
                  })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={formData.transport.fuelType}
                  onChange={(e) => setFormData({
                    ...formData,
                    transport: {...formData.transport, fuelType: e.target.value}
                  })}
                  className="input-field"
                >
                  {fuelTypes.map(fuel => (
                    <option key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Emissions (kg CO₂)
                </label>
                <input
                  type="number"
                  value={formData.emissions.current.value}
                  onChange={(e) => setFormData({
                    ...formData,
                    emissions: {
                      ...formData.emissions,
                      current: {...formData.emissions.current, value: parseFloat(e.target.value)}
                    }
                  })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternative Emissions (kg CO₂)
                </label>
                <input
                  type="number"
                  value={formData.emissions.alternative.value}
                  onChange={(e) => setFormData({
                    ...formData,
                    emissions: {
                      ...formData.emissions,
                      alternative: {...formData.emissions.alternative, value: parseFloat(e.target.value)}
                    }
                  })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.schedule.frequency}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: {...formData.schedule, frequency: e.target.value}
                  })}
                  className="input-field"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRoute(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingRoute ? 'Update Route' : 'Add Route'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Routes List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Routes</h3>
        <div className="space-y-4">
          {filteredRoutes.map((route) => (
            <div key={route._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Truck className="h-8 w-8 text-eco-blue" />
                  <div>
                    <h4 className="font-medium text-gray-900">{route.route.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{route.route.origin.location}</span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{route.route.destination.location}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">
                        {route.transport.mode.replace('_', ' ')} • {route.route.distance.value} km
                      </span>
                      <span className="text-sm text-gray-600">
                        {route.schedule.frequency.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {route.emissions.current.value} kg CO₂
                  </div>
                  {route.emissions.saved.value > 0 && (
                    <div className="text-sm text-green-600">
                      +{route.emissions.saved.value} kg saved
                    </div>
                  )}
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEdit(route)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(route._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredRoutes.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No routes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logistics; 