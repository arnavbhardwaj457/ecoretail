# 🌱 EcoRetail Setup Guide

## Prerequisites

### 1. Install Node.js
- Download from [https://nodejs.org/](https://nodejs.org/)
- Install with default settings
- Restart your terminal after installation

### 2. Install MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update the `.env` file with your connection string

**Option B: Local MongoDB**
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run as a Windows service

## Setup Steps

### Step 1: Configure Environment Variables

The `.env` file is already created in the backend directory with these settings:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecoretail

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=ecoretail-super-secret-jwt-key-2024-sparkathon

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**If using MongoDB Atlas, replace the MONGODB_URI with your connection string:**

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/ecoretail
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 EcoRetail server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

You should see:
```
Local:            http://localhost:3000
```

### Step 4: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Troubleshooting

### MongoDB Connection Issues

1. **If using local MongoDB:**
   - Make sure MongoDB service is running
   - Check if MongoDB is installed correctly
   - Try: `mongod --version`

2. **If using MongoDB Atlas:**
   - Verify your connection string
   - Make sure your IP is whitelisted
   - Check if username/password are correct

### Node.js Issues

1. **If npm commands don't work:**
   - Reinstall Node.js
   - Restart your terminal
   - Check: `node --version` and `npm --version`

### Port Issues

1. **If port 5000 is in use:**
   - Change PORT in .env file
   - Or kill the process using port 5000

2. **If port 3000 is in use:**
   - React will automatically use the next available port
   - Or kill the process using port 3000

## Application Features

Once running, you can:

1. **Register/Login** - Create an account or sign in
2. **Dashboard** - View sustainability overview
3. **Suppliers** - Manage supplier sustainability tracking
4. **Logistics** - Track transport routes and emissions
5. **Marketplace** - List and find materials for reuse
6. **AI Suggestions** - Get personalized sustainability recommendations
7. **Profile** - Manage your account settings

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/suppliers` - Get suppliers
- `GET /api/logistics` - Get logistics routes
- `GET /api/marketplace` - Get marketplace listings
- `GET /api/ai-suggestions` - Get AI suggestions

🌱 **Ready to build a sustainable future!** 