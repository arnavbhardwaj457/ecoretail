const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const supplierRoutes = require('./routes/suppliers');
const logisticsRoutes = require('./routes/logistics');
const marketplaceRoutes = require('./routes/marketplace');
const aiSuggestionsRoutes = require('./routes/aiSuggestions');
const predictFreshnessRoutes = require('./routes/predictFreshness');
const aiChatRoutes = require('./routes/aiChat');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoretail', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/ai-suggestions', aiSuggestionsRoutes);
app.use('/api/predict-freshness', predictFreshnessRoutes);
app.use('/api/ai-chat', aiChatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EcoRetail API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🌱 Welcome to EcoRetail API',
    version: '1.0.0',
    description: 'Sustainable retail platform for Walmart Sparkathon',
    endpoints: {
      auth: '/api/auth',
      suppliers: '/api/suppliers',
      logistics: '/api/logistics',
      marketplace: '/api/marketplace',
      aiSuggestions: '/api/ai-suggestions'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EcoRetail server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
}); 