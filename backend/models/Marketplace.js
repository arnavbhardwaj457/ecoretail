const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['packaging', 'electronics', 'textiles', 'furniture', 'construction', 'food_waste', 'chemicals', 'other'],
    required: true
  },
  material: {
    type: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      value: { type: Number, required: true },
      unit: { type: String, required: true }
    },
    condition: {
      type: String,
      enum: ['new', 'like_new', 'good', 'fair', 'poor'],
      default: 'good'
    },
    specifications: {
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: { type: String, default: 'cm' }
      },
      weight: {
        value: Number,
        unit: { type: String, default: 'kg' }
      },
      material: String,
      color: String,
      brand: String
    }
  },
  location: {
    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, required: true }
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    pickupRadius: {
      value: { type: Number, default: 50 },
      unit: { type: String, default: 'km' }
    }
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'negotiable', 'fixed'],
      default: 'free'
    },
    amount: {
      value: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' }
    },
    originalValue: {
      value: Number,
      currency: { type: String, default: 'USD' }
    }
  },
  sustainability: {
    carbonSaved: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'kg CO2e' }
    },
    wasteDiverted: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'kg' }
    },
    lifecycleExtension: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'years' }
    }
  },
  images: [{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold', 'expired'],
    default: 'available'
  },
  expiryDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  contact: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  inquiries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    contactInfo: {
      name: String,
      email: String,
      phone: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'responded', 'accepted', 'declined'],
      default: 'pending'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate sustainability impact
marketplaceSchema.methods.calculateSustainabilityImpact = function() {
  // Mock calculation based on material type and quantity
  const impactFactors = {
    packaging: { carbon: 0.5, waste: 1.0, lifecycle: 0.1 },
    electronics: { carbon: 2.0, waste: 0.8, lifecycle: 3.0 },
    textiles: { carbon: 0.3, waste: 0.5, lifecycle: 2.0 },
    furniture: { carbon: 1.5, waste: 1.2, lifecycle: 5.0 },
    construction: { carbon: 3.0, waste: 2.0, lifecycle: 10.0 },
    food_waste: { carbon: 0.1, waste: 0.3, lifecycle: 0.0 },
    chemicals: { carbon: 1.0, waste: 0.7, lifecycle: 1.0 },
    other: { carbon: 0.5, waste: 0.5, lifecycle: 1.0 }
  };

  const factor = impactFactors[this.category] || impactFactors.other;
  const quantity = this.material.quantity.value;

  this.sustainability = {
    carbonSaved: {
      value: Math.round(factor.carbon * quantity),
      unit: 'kg CO2e'
    },
    wasteDiverted: {
      value: Math.round(factor.waste * quantity),
      unit: 'kg'
    },
    lifecycleExtension: {
      value: factor.lifecycle,
      unit: 'years'
    }
  };

  return this.sustainability;
};

// Check if listing is expired
marketplaceSchema.methods.isExpired = function() {
  return new Date() > this.expiryDate;
};

module.exports = mongoose.model('Marketplace', marketplaceSchema); 