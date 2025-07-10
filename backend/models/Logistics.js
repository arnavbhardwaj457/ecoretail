const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  route: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    origin: {
      location: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    destination: {
      location: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    distance: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'km' }
    }
  },
  transport: {
    mode: {
      type: String,
      enum: ['truck', 'train', 'ship', 'plane', 'electric_vehicle', 'bicycle', 'walking'],
      required: true
    },
    vehicleType: {
      type: String,
      trim: true
    },
    fuelType: {
      type: String,
      enum: ['diesel', 'gasoline', 'electric', 'hybrid', 'biodiesel', 'hydrogen', 'none'],
      default: 'diesel'
    },
    capacity: {
      value: { type: Number },
      unit: { type: String, default: 'kg' }
    }
  },
  emissions: {
    current: {
      value: { type: Number, required: true },
      unit: { type: String, default: 'kg CO2e' }
    },
    alternative: {
      value: { type: Number },
      unit: { type: String, default: 'kg CO2e' }
    },
    saved: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'kg CO2e' }
    }
  },
  costs: {
    current: {
      value: { type: Number },
      currency: { type: String, default: 'USD' }
    },
    alternative: {
      value: { type: Number },
      currency: { type: String, default: 'USD' }
    },
    savings: {
      value: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' }
    }
  },
  schedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'on_demand'],
      default: 'weekly'
    },
    lastTrip: { type: Date },
    nextTrip: { type: Date }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'optimized', 'pending_optimization'],
    default: 'active'
  },
  optimization: {
    suggestions: [{
      type: { type: String, enum: ['route_change', 'mode_change', 'vehicle_upgrade', 'schedule_optimization'] },
      description: String,
      potentialSavings: {
        emissions: { type: Number, default: 0 },
        cost: { type: Number, default: 0 }
      },
      implementationCost: { type: Number, default: 0 },
      paybackPeriod: { type: Number, default: 0 }
    }],
    implemented: [{
      type: { type: String },
      description: String,
      implementedDate: { type: Date, default: Date.now },
      actualSavings: {
        emissions: { type: Number, default: 0 },
        cost: { type: Number, default: 0 }
      }
    }]
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate emissions savings
logisticsSchema.methods.calculateEmissionsSavings = function() {
  if (this.emissions.current.value && this.emissions.alternative.value) {
    this.emissions.saved.value = this.emissions.current.value - this.emissions.alternative.value;
  }
  return this.emissions.saved;
};

// Calculate cost savings
logisticsSchema.methods.calculateCostSavings = function() {
  if (this.costs.current.value && this.costs.alternative.value) {
    this.costs.savings.value = this.costs.current.value - this.costs.alternative.value;
  }
  return this.costs.savings;
};

module.exports = mongoose.model('Logistics', logisticsSchema); 