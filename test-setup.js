const fs = require('fs');
const path = require('path');

console.log('🌱 EcoRetail Application Setup Test');
console.log('=====================================\n');

// Check if required directories exist
const requiredDirs = ['frontend', 'backend'];
const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

if (missingDirs.length > 0) {
  console.log('❌ Missing required directories:', missingDirs.join(', '));
  process.exit(1);
}

console.log('✅ Required directories found');

// Check if package.json files exist
const frontendPackage = path.join('frontend', 'package.json');
const backendPackage = path.join('backend', 'package.json');

if (!fs.existsSync(frontendPackage)) {
  console.log('❌ Frontend package.json not found');
  process.exit(1);
}

if (!fs.existsSync(backendPackage)) {
  console.log('❌ Backend package.json not found');
  process.exit(1);
}

console.log('✅ Package.json files found');

// Check if key frontend files exist
const frontendFiles = [
  'frontend/src/App.js',
  'frontend/src/index.js',
  'frontend/src/contexts/AuthContext.js',
  'frontend/src/contexts/DataContext.js',
  'frontend/src/components/Layout.js',
  'frontend/src/pages/Dashboard.js',
  'frontend/src/pages/Suppliers.js',
  'frontend/src/pages/Logistics.js',
  'frontend/src/pages/Marketplace.js',
  'frontend/src/pages/AiSuggestions.js',
  'frontend/src/pages/Profile.js'
];

const missingFrontendFiles = frontendFiles.filter(file => !fs.existsSync(file));

if (missingFrontendFiles.length > 0) {
  console.log('❌ Missing frontend files:', missingFrontendFiles.join(', '));
  process.exit(1);
}

console.log('✅ All frontend files found');

// Check if key backend files exist
const backendFiles = [
  'backend/server.js',
  'backend/models/User.js',
  'backend/models/Supplier.js',
  'backend/models/Logistics.js',
  'backend/models/Marketplace.js',
  'backend/models/AiSuggestion.js',
  'backend/routes/auth.js',
  'backend/routes/suppliers.js',
  'backend/routes/logistics.js',
  'backend/routes/marketplace.js',
  'backend/routes/aiSuggestions.js'
];

const missingBackendFiles = backendFiles.filter(file => !fs.existsSync(file));

if (missingBackendFiles.length > 0) {
  console.log('❌ Missing backend files:', missingBackendFiles.join(', '));
  process.exit(1);
}

console.log('✅ All backend files found');

// Check if environment file exists
if (!fs.existsSync('.env')) {
  console.log('⚠️  .env file not found. Please copy env.example to .env and configure your environment variables.');
} else {
  console.log('✅ Environment file found');
}

console.log('\n🎉 Setup verification completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Copy env.example to .env and configure your MongoDB connection');
console.log('2. Run "npm install" in both frontend and backend directories');
console.log('3. Start the backend: cd backend && npm start');
console.log('4. Start the frontend: cd frontend && npm start');
console.log('5. Access the application at http://localhost:3000');
console.log('\n🌱 Ready to build a sustainable future!'); 