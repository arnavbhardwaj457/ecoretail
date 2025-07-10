const fs = require('fs');
const path = require('path');

console.log('🌱 EcoRetail MongoDB Setup Script');
console.log('===================================\n');

// Create .env file for backend
const envContent = `# MongoDB Configuration
# For MongoDB Atlas (recommended):
# MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/ecoretail

# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ecoretail

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (for authentication)
JWT_SECRET=ecoretail-super-secret-jwt-key-2024-sparkathon

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_VERSION=v1
`;

// Write .env file to backend directory
const backendEnvPath = path.join(__dirname, 'backend', '.env');
fs.writeFileSync(backendEnvPath, envContent);

console.log('✅ Created backend/.env file');
console.log('\n📋 Next Steps:');
console.log('1. Install Node.js from https://nodejs.org/');
console.log('2. Install MongoDB:');
console.log('   - Option A: Download from https://www.mongodb.com/try/download/community');
console.log('   - Option B: Use MongoDB Atlas (recommended) at https://www.mongodb.com/atlas');
console.log('3. Run these commands:');
console.log('   cd backend && npm install && npm start');
console.log('   cd frontend && npm install && npm start');
console.log('\n🌱 Your EcoRetail application will be ready!'); 