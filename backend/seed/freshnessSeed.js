const mongoose = require('mongoose');
const FreshnessPrediction = require('../models/FreshnessPrediction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoretail';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await FreshnessPrediction.deleteMany({});
  await FreshnessPrediction.insertMany([
    {
      productName: 'Strawberries',
      harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      transportTemperature: 4,
      storeTemperature: 6,
      storeHumidity: 85,
      shelfLife: 7,
      salesVelocity: 3,
      predictedScore: 85,
      predictedShelfLife: 5,
      suggestedAction: 'No action',
    },
    {
      productName: 'Spinach',
      harvestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      transportTemperature: 10,
      storeTemperature: 9,
      storeHumidity: 92,
      shelfLife: 7,
      salesVelocity: 1,
      predictedScore: 45,
      predictedShelfLife: 2,
      suggestedAction: 'Use for prepared foods or re-route',
    },
    {
      productName: 'Bananas',
      harvestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      transportTemperature: 12,
      storeTemperature: 12,
      storeHumidity: 80,
      shelfLife: 10,
      salesVelocity: 2,
      predictedScore: 60,
      predictedShelfLife: 3,
      suggestedAction: 'Move to clearance section',
    },
  ]);
  console.log('Seeded freshness predictions!');
  await mongoose.disconnect();
}

seed(); 