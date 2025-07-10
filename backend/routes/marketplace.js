const express = require('express');
const { body, validationResult } = require('express-validator');
const Marketplace = require('../models/Marketplace');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all marketplace listings (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, condition, search, location } = req.query;
    
    const query = { status: 'available' };
    
    if (category) query.category = category;
    if (condition) query['material.condition'] = condition;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'material.type': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (location) {
      query['location.address.city'] = { $regex: location, $options: 'i' };
    }

    const listings = await Marketplace.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username company.name')
      .exec();

    const total = await Marketplace.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get marketplace listings error:', error);
    res.status(500).json({
      error: 'Failed to fetch marketplace listings',
      message: error.message
    });
  }
});

// Get marketplace listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Marketplace.findById(req.params.id)
      .populate('createdBy', 'username company.name profile');

    if (!listing) {
      return res.status(404).json({
        error: 'Marketplace listing not found'
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({ listing });

  } catch (error) {
    console.error('Get marketplace listing error:', error);
    res.status(500).json({
      error: 'Failed to fetch marketplace listing',
      message: error.message
    });
  }
});

// Get user's marketplace listings
router.get('/user/listings', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { createdBy: req.user._id };
    if (status) query.status = status;

    const listings = await Marketplace.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Marketplace.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({
      error: 'Failed to fetch user listings',
      message: error.message
    });
  }
});

// Create new marketplace listing
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['packaging', 'electronics', 'textiles', 'furniture', 'construction', 'food_waste', 'chemicals', 'other'])
    .withMessage('Valid category is required'),
  body('material.type').notEmpty().withMessage('Material type is required'),
  body('material.quantity.value').isNumeric().withMessage('Quantity must be a number'),
  body('material.quantity.unit').notEmpty().withMessage('Quantity unit is required'),
  body('location.address.city').notEmpty().withMessage('City is required'),
  body('location.address.country').notEmpty().withMessage('Country is required'),
  body('contact.name').notEmpty().withMessage('Contact name is required'),
  body('contact.email').isEmail().withMessage('Valid contact email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const listingData = {
      ...req.body,
      createdBy: req.user._id
    };

    const listing = new Marketplace(listingData);
    
    // Calculate sustainability impact
    listing.calculateSustainabilityImpact();
    
    await listing.save();

    res.status(201).json({
      message: 'Marketplace listing created successfully',
      listing
    });

  } catch (error) {
    console.error('Create marketplace listing error:', error);
    res.status(500).json({
      error: 'Failed to create marketplace listing',
      message: error.message
    });
  }
});

// Update marketplace listing
router.put('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isIn(['packaging', 'electronics', 'textiles', 'furniture', 'construction', 'food_waste', 'chemicals', 'other'])
    .withMessage('Valid category is required'),
  body('contact.email').optional().isEmail().withMessage('Valid contact email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const listing = await Marketplace.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        error: 'Marketplace listing not found'
      });
    }

    // Update listing data
    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy' && key !== '_id') {
        listing[key] = req.body[key];
      }
    });

    // Recalculate sustainability impact
    listing.calculateSustainabilityImpact();
    
    await listing.save();

    res.json({
      message: 'Marketplace listing updated successfully',
      listing
    });

  } catch (error) {
    console.error('Update marketplace listing error:', error);
    res.status(500).json({
      error: 'Failed to update marketplace listing',
      message: error.message
    });
  }
});

// Delete marketplace listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Marketplace.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        error: 'Marketplace listing not found'
      });
    }

    res.json({
      message: 'Marketplace listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete marketplace listing error:', error);
    res.status(500).json({
      error: 'Failed to delete marketplace listing',
      message: error.message
    });
  }
});

// Add inquiry to listing
router.post('/:id/inquiry', [
  body('message').notEmpty().withMessage('Message is required'),
  body('contactInfo.name').notEmpty().withMessage('Contact name is required'),
  body('contactInfo.email').isEmail().withMessage('Valid contact email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const listing = await Marketplace.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        error: 'Marketplace listing not found'
      });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({
        error: 'This listing is not available for inquiries'
      });
    }

    listing.inquiries.push({
      message: req.body.message,
      contactInfo: req.body.contactInfo
    });

    await listing.save();

    res.json({
      message: 'Inquiry sent successfully',
      listing
    });

  } catch (error) {
    console.error('Add inquiry error:', error);
    res.status(500).json({
      error: 'Failed to send inquiry',
      message: error.message
    });
  }
});

// Update listing status
router.patch('/:id/status', auth, [
  body('status').isIn(['available', 'reserved', 'sold', 'expired'])
    .withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const listing = await Marketplace.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        error: 'Marketplace listing not found'
      });
    }

    listing.status = req.body.status;
    await listing.save();

    res.json({
      message: 'Listing status updated successfully',
      listing
    });

  } catch (error) {
    console.error('Update listing status error:', error);
    res.status(500).json({
      error: 'Failed to update listing status',
      message: error.message
    });
  }
});

// Get marketplace analytics
router.get('/analytics/impact', auth, async (req, res) => {
  try {
    const listings = await Marketplace.find({ createdBy: req.user._id });
    
    const analytics = {
      totalListings: listings.length,
      totalViews: 0,
      totalInquiries: 0,
      totalCarbonSaved: 0,
      totalWasteDiverted: 0,
      categoryBreakdown: {},
      statusBreakdown: {}
    };

    if (listings.length > 0) {
      listings.forEach(listing => {
        analytics.totalViews += listing.views;
        analytics.totalInquiries += listing.inquiries.length;
        analytics.totalCarbonSaved += listing.sustainability.carbonSaved.value;
        analytics.totalWasteDiverted += listing.sustainability.wasteDiverted.value;
        
        // Category breakdown
        if (!analytics.categoryBreakdown[listing.category]) {
          analytics.categoryBreakdown[listing.category] = {
            count: 0,
            views: 0,
            inquiries: 0
          };
        }
        analytics.categoryBreakdown[listing.category].count++;
        analytics.categoryBreakdown[listing.category].views += listing.views;
        analytics.categoryBreakdown[listing.category].inquiries += listing.inquiries.length;
        
        // Status breakdown
        if (!analytics.statusBreakdown[listing.status]) {
          analytics.statusBreakdown[listing.status] = 0;
        }
        analytics.statusBreakdown[listing.status]++;
      });
    }

    res.json({ analytics });

  } catch (error) {
    console.error('Get marketplace analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch marketplace analytics',
      message: error.message
    });
  }
});

module.exports = router; 