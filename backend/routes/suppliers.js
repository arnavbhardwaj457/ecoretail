const express = require('express');
const { body, validationResult } = require('express-validator');
const Supplier = require('../models/Supplier');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all suppliers for current user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    
    const query = { addedBy: req.user._id };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const suppliers = await Supplier.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Supplier.countDocuments(query);

    res.json({
      suppliers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      error: 'Failed to fetch suppliers',
      message: error.message
    });
  }
});

// Get supplier by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      addedBy: req.user._id
    });

    if (!supplier) {
      return res.status(404).json({
        error: 'Supplier not found'
      });
    }

    res.json({ supplier });

  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({
      error: 'Failed to fetch supplier',
      message: error.message
    });
  }
});

// Create new supplier
router.post('/', auth, [
  body('name').notEmpty().withMessage('Supplier name is required'),
  body('company').notEmpty().withMessage('Company name is required'),
  body('contact.email').isEmail().withMessage('Valid email is required'),
  body('category').isIn(['raw_materials', 'packaging', 'electronics', 'textiles', 'food', 'chemicals', 'other'])
    .withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const supplierData = {
      ...req.body,
      addedBy: req.user._id
    };

    const supplier = new Supplier(supplierData);
    
    // Calculate initial sustainability score
    supplier.calculateSustainabilityScore();
    
    await supplier.save();

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier
    });

  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      error: 'Failed to create supplier',
      message: error.message
    });
  }
});

// Update supplier
router.put('/:id', auth, [
  body('name').optional().notEmpty().withMessage('Supplier name cannot be empty'),
  body('contact.email').optional().isEmail().withMessage('Valid email is required'),
  body('category').optional().isIn(['raw_materials', 'packaging', 'electronics', 'textiles', 'food', 'chemicals', 'other'])
    .withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const supplier = await Supplier.findOne({
      _id: req.params.id,
      addedBy: req.user._id
    });

    if (!supplier) {
      return res.status(404).json({
        error: 'Supplier not found'
      });
    }

    // Update supplier data
    Object.keys(req.body).forEach(key => {
      if (key !== 'addedBy' && key !== '_id') {
        supplier[key] = req.body[key];
      }
    });

    // Recalculate sustainability score
    supplier.calculateSustainabilityScore();
    
    await supplier.save();

    res.json({
      message: 'Supplier updated successfully',
      supplier
    });

  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      error: 'Failed to update supplier',
      message: error.message
    });
  }
});

// Delete supplier
router.delete('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({
      _id: req.params.id,
      addedBy: req.user._id
    });

    if (!supplier) {
      return res.status(404).json({
        error: 'Supplier not found'
      });
    }

    res.json({
      message: 'Supplier deleted successfully'
    });

  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      error: 'Failed to delete supplier',
      message: error.message
    });
  }
});

// Get sustainability analytics
router.get('/analytics/sustainability', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.find({ addedBy: req.user._id });
    
    const analytics = {
      totalSuppliers: suppliers.length,
      averageScore: 0,
      scoreDistribution: {
        excellent: 0, // 80-100
        good: 0,      // 60-79
        fair: 0,      // 40-59
        poor: 0       // 0-39
      },
      categoryBreakdown: {},
      certifications: {
        total: 0,
        active: 0,
        expired: 0
      }
    };

    if (suppliers.length > 0) {
      let totalScore = 0;
      
      suppliers.forEach(supplier => {
        totalScore += supplier.sustainabilityScore.overall;
        
        // Score distribution
        if (supplier.sustainabilityScore.overall >= 80) analytics.scoreDistribution.excellent++;
        else if (supplier.sustainabilityScore.overall >= 60) analytics.scoreDistribution.good++;
        else if (supplier.sustainabilityScore.overall >= 40) analytics.scoreDistribution.fair++;
        else analytics.scoreDistribution.poor++;
        
        // Category breakdown
        if (!analytics.categoryBreakdown[supplier.category]) {
          analytics.categoryBreakdown[supplier.category] = {
            count: 0,
            averageScore: 0,
            totalScore: 0
          };
        }
        analytics.categoryBreakdown[supplier.category].count++;
        analytics.categoryBreakdown[supplier.category].totalScore += supplier.sustainabilityScore.overall;
        
        // Certifications
        supplier.certifications.forEach(cert => {
          analytics.certifications.total++;
          if (cert.status === 'active') analytics.certifications.active++;
          else if (cert.status === 'expired') analytics.certifications.expired++;
        });
      });
      
      analytics.averageScore = Math.round(totalScore / suppliers.length);
      
      // Calculate average scores for categories
      Object.keys(analytics.categoryBreakdown).forEach(category => {
        const cat = analytics.categoryBreakdown[category];
        cat.averageScore = Math.round(cat.totalScore / cat.count);
      });
    }

    res.json({ analytics });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Recalculate sustainability scores
router.post('/:id/recalculate-score', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      addedBy: req.user._id
    });

    if (!supplier) {
      return res.status(404).json({
        error: 'Supplier not found'
      });
    }

    const newScore = supplier.calculateSustainabilityScore();
    await supplier.save();

    res.json({
      message: 'Sustainability score recalculated',
      supplier,
      newScore
    });

  } catch (error) {
    console.error('Recalculate score error:', error);
    res.status(500).json({
      error: 'Failed to recalculate score',
      message: error.message
    });
  }
});

module.exports = router; 