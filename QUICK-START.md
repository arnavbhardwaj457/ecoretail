# 🚀 EcoRetail Quick Start Guide

## ✅ What's Been Set Up

1. **✅ Backend Environment** - `.env` file created with MongoDB configuration
2. **✅ Frontend Environment** - All React components and routing fixed
3. **✅ Database Models** - All MongoDB schemas ready
4. **✅ API Routes** - Complete REST API endpoints
5. **✅ Start Scripts** - Easy startup scripts created

## 🎯 Next Steps

### 1. Install Prerequisites

**Node.js:**
- Download from [https://nodejs.org/](https://nodejs.org/)
- Install with default settings
- Restart your terminal

**MongoDB (Choose One):**

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend/.env` with your connection string

**Option B: Local MongoDB**
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install with default settings

### 2. Start the Application

**Option A: Use the start script (Windows)**
```bash
# Double-click start-app.bat
# OR run in terminal:
./start-app.bat
```

**Option B: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 🔧 Configuration Files

### Backend Environment (backend/.env)
```env
MONGODB_URI=mongodb://localhost:27017/ecoretail
PORT=5000
NODE_ENV=development
JWT_SECRET=ecoretail-super-secret-jwt-key-2024-sparkathon
CORS_ORIGIN=http://localhost:3000
```

### For MongoDB Atlas, replace MONGODB_URI with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoretail
```

## 🌱 Application Features

Once running, you can:

1. **Register/Login** - Create account or sign in
2. **Dashboard** - View sustainability overview
3. **Suppliers** - Track supplier sustainability scores
4. **Logistics** - Monitor transport emissions
5. **Marketplace** - List/find materials for reuse
6. **AI Suggestions** - Get sustainability recommendations
7. **Profile** - Manage account settings

## 🚨 Troubleshooting

### If npm commands don't work:
- Reinstall Node.js
- Restart terminal
- Check: `node --version`

### If MongoDB connection fails:
- For local: Make sure MongoDB service is running
- For Atlas: Check connection string and IP whitelist

### If ports are in use:
- Backend: Change PORT in .env
- Frontend: React will auto-use next available port

## 📞 Support

- Check `SETUP-GUIDE.md` for detailed instructions
- Check `README.md` for project overview
- All files are properly configured and ready to run!

🌱 **Ready to build a sustainable future!** 