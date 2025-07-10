const express = require('express');
const FreshnessPrediction = require('../models/FreshnessPrediction');

const router = express.Router();

// Simple AI logic for freshness prediction
function predictFreshness({
  harvestDate,
  transportTemperature,
  storeTemperature,
  storeHumidity,
  shelfLife,
  salesVelocity
}) {
  // Days since harvest
  const daysSinceHarvest = (Date.now() - new Date(harvestDate).getTime()) / (1000 * 60 * 60 * 24);
  // Start with 100
  let score = 100;
  // Subtract for age
  score -= daysSinceHarvest * 5;
  // Subtract for high/low transport temp (ideal: 2-8C)
  if (transportTemperature < 2 || transportTemperature > 8) score -= 10;
  // Subtract for high/low store temp (ideal: 2-8C)
  if (storeTemperature < 2 || storeTemperature > 8) score -= 10;
  // Subtract for high humidity (>90%)
  if (storeHumidity > 90) score -= 10;
  // Subtract for low sales velocity (<2/day)
  if (salesVelocity < 2) score -= 10;
  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));
  // Estimate shelf life left
  let predictedShelfLife = Math.max(0, Math.round(shelfLife - daysSinceHarvest));
  // Suggest action
  let suggestedAction = 'No action';
  if (score < 40) suggestedAction = 'Discard if unsafe';
  else if (score < 60) suggestedAction = 'Use for prepared foods or re-route';
  else if (score < 80) suggestedAction = 'Move to clearance section';

  return { score, predictedShelfLife, suggestedAction };
}

// POST /api/predict-freshness
router.post('/', async (req, res) => {
  try {
    const {
      productName,
      harvestDate,
      transportTemperature,
      storeTemperature,
      storeHumidity,
      shelfLife,
      salesVelocity
    } = req.body;

    const { score, predictedShelfLife, suggestedAction } = predictFreshness({
      harvestDate,
      transportTemperature,
      storeTemperature,
      storeHumidity,
      shelfLife,
      salesVelocity
    });

    const prediction = new FreshnessPrediction({
      productName,
      harvestDate,
      transportTemperature,
      storeTemperature,
      storeHumidity,
      shelfLife,
      salesVelocity,
      predictedScore: score,
      predictedShelfLife,
      suggestedAction
    });
    await prediction.save();

    res.json({
      productName,
      harvestDate,
      transportTemperature,
      storeTemperature,
      storeHumidity,
      shelfLife,
      salesVelocity,
      predictedScore: score,
      predictedShelfLife,
      suggestedAction
    });
  } catch (err) {
    res.status(400).json({ error: 'Prediction failed', details: err.message });
  }
});

module.exports = router; 