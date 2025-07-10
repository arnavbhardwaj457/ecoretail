const mongoose = require('mongoose');

const freshnessPredictionSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  harvestDate: { type: Date, required: true },
  transportTemperature: { type: Number, required: true },
  storeTemperature: { type: Number, required: true },
  storeHumidity: { type: Number, required: true },
  shelfLife: { type: Number, required: true }, // in days
  salesVelocity: { type: Number, required: true }, // units per day
  predictedScore: { type: Number, required: true }, // 0-100
  predictedShelfLife: { type: Number, required: true }, // in days
  suggestedAction: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FreshnessPrediction', freshnessPredictionSchema); 