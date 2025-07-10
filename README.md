# 🌱 EcoRetail - Sustainable Retail Platform

A full-stack web application for the Walmart Sparkathon hackathon with the theme "Retail with purpose: Building a sustainable and responsible future".

## 🎯 Project Overview

EcoRetail helps retailers push the boundaries of sustainability by providing tools for:
- **Sustainable Sourcing Dashboard**: Track suppliers and calculate sustainability scores
- **Green Logistics Tracker**: Visualize CO₂ emissions saved through greener transport
- **AI-powered Waste Reduction**: Get personalized suggestions to reduce waste
- **Circular Economy Marketplace**: Connect businesses for material reuse

## 🚀 Features

### Frontend (React + Tailwind CSS)
- Responsive, modern UI with eco-friendly design
- Interactive dashboards with data visualizations
- Real-time sustainability metrics
- Clean, intuitive user experience

### Backend (Node.js + Express + MongoDB)
- RESTful APIs for all CRUD operations
- MongoDB database with comprehensive schemas
- Mock authentication system
- Scalable architecture for future integrations

## 📁 Project Structure

```
ecoretail/
├── frontend/          # React application
├── backend/           # Node.js/Express server
├── README.md         # This file
└── .env.example      # Environment variables template
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/ecoretail
# or for Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoretail
```

### 3. Start the Application

```bash
# Terminal 1: Start backend server
cd backend
npm start

# Terminal 2: Start frontend development server
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 📊 Database Schemas

### Users
- Authentication data
- Role-based access (retailer, admin)

### Suppliers
- Company information
- Sustainability metrics
- Certification data

### Logistics
- Transport routes
- Emissions data
- Green alternatives

### Marketplace
- Material listings
- Reuse opportunities
- Transaction tracking

## 🎨 Design Features

- **Eco-friendly Color Palette**: Greens, earth tones, and clean whites
- **Responsive Design**: Works on all device sizes
- **Data Visualizations**: Charts, progress bars, and metrics
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## 🔮 Future Enhancements

- Real-time data integration with external APIs
- Advanced AI/ML for waste reduction suggestions
- Blockchain for supply chain transparency
- Mobile application
- Advanced analytics and reporting

## 🚀 Deployment Options

### Frontend
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront

### Backend
- Heroku
- AWS EC2
- Google Cloud Platform
- DigitalOcean

### Database
- MongoDB Atlas (recommended)
- AWS DocumentDB
- Self-hosted MongoDB

## 🤝 Contributing

This project was built for the Walmart Sparkathon hackathon. For questions or contributions, please refer to the project documentation.

## 📄 License

This project is created for educational and hackathon purposes.

---

**Built with ❤️ for a sustainable future** 🌱 # ecoretail
