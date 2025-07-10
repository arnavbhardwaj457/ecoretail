const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  category: {
    type: String,
    enum: ['raw_materials', 'packaging', 'electronics', 'textiles', 'food', 'chemicals', 'other'],
    required: true
  },
  sustainabilityMetrics: {
    carbonFootprint: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'kg CO2e' },
      lastUpdated: { type: Date, default: Date.now }
    },
    waterUsage: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'liters' },
      lastUpdated: { type: Date, default: Date.now }
    },
    wasteGenerated: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: 'kg' },
      lastUpdated: { type: Date, default: Date.now }
    },
    renewableEnergy: {
      percentage: { type: Number, default: 0, min: 0, max: 100 },
      lastUpdated: { type: Date, default: Date.now }
    }
  },
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'expired', 'pending'],
      default: 'active'
    }
  }],
  sustainabilityScore: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    environmental: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    social: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    governance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },
  practices: {
    fairTrade: { type: Boolean, default: false },
    organic: { type: Boolean, default: false },
    localSourcing: { type: Boolean, default: false },
    recycledMaterials: { type: Boolean, default: false },
    energyEfficient: { type: Boolean, default: false },
    wasteReduction: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_review'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate sustainability score
supplierSchema.methods.calculateSustainabilityScore = function() {
  let environmentalScore = 0;
  let socialScore = 0;
  let governanceScore = 0;

  // Environmental score calculation
  if (this.sustainabilityMetrics.renewableEnergy.percentage > 80) environmentalScore += 30;
  else if (this.sustainabilityMetrics.renewableEnergy.percentage > 50) environmentalScore += 20;
  else if (this.sustainabilityMetrics.renewableEnergy.percentage > 20) environmentalScore += 10;

  if (this.practices.energyEfficient) environmentalScore += 15;
  if (this.practices.wasteReduction) environmentalScore += 15;
  if (this.practices.recycledMaterials) environmentalScore += 10;

  // Social score calculation
  if (this.practices.fairTrade) socialScore += 25;
  if (this.practices.organic) socialScore += 20;
  if (this.practices.localSourcing) socialScore += 15;

  // Governance score calculation
  const activeCertifications = this.certifications.filter(cert => cert.status === 'active').length;
  governanceScore = Math.min(activeCertifications * 20, 100);

  // Overall score
  const overallScore = Math.round((environmentalScore + socialScore + governanceScore) / 3);

  this.sustainabilityScore = {
    environmental: environmentalScore,
    social: socialScore,
    governance: governanceScore,
    overall: overallScore,
    lastCalculated: new Date()
  };

  return this.sustainabilityScore;
};

module.exports = mongoose.model('Supplier', supplierSchema); 