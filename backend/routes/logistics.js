const express = require('express');
const { body, validationResult } = require('express-validator');
const Logistics = require('../models/Logistics');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all logistics routes for current user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, mode, status, search } = req.query;
    
    const query = { createdBy: req.user._id };
    
    if (mode) query['transport.mode'] = mode;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { 'route.name': { $regex: search, $options: 'i' } },
        { 'route.origin.location': { $regex: search, $options: 'i' } },
        { 'route.destination.location': { $regex: search, $options: 'i' } }
      ];
    }

    const routes = await Logistics.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Logistics.countDocuments(query);

    res.json({
      routes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get logistics error:', error);
    res.status(500).json({
      error: 'Failed to fetch logistics routes',
      message: error.message
    });
  }
});

// Get logistics route by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const route = await Logistics.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!route) {
      return res.status(404).json({
        error: 'Logistics route not found'
      });
    }

    res.json({ route });

  } catch (error) {
    console.error('Get logistics route error:', error);
    res.status(500).json({
      error: 'Failed to fetch logistics route',
      message: error.message
    });
  }
});

// Create new logistics route
router.post('/', auth, [
  body('route.name').notEmpty().withMessage('Route name is required'),
  body('route.origin.location').notEmpty().withMessage('Origin location is required'),
  body('route.destination.location').notEmpty().withMessage('Destination location is required'),
  body('route.distance.value').isNumeric().withMessage('Distance must be a number'),
  body('transport.mode').isIn(['truck', 'train', 'ship', 'plane', 'electric_vehicle', 'bicycle', 'walking'])
    .withMessage('Valid transport mode is required'),
  body('emissions.current.value').isNumeric().withMessage('Current emissions must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const routeData = {
      ...req.body,
      createdBy: req.user._id
    };

    const route = new Logistics(routeData);
    
    // Calculate emissions savings if alternative is provided
    if (route.emissions.alternative.value) {
      route.calculateEmissionsSavings();
    }
    
    // Calculate cost savings if alternative is provided
    if (route.costs.alternative.value) {
      route.calculateCostSavings();
    }
    
    await route.save();

    res.status(201).json({
      message: 'Logistics route created successfully',
      route
    });

  } catch (error) {
    console.error('Create logistics route error:', error);
    res.status(500).json({
      error: 'Failed to create logistics route',
      message: error.message
    });
  }
});

// Update logistics route
router.put('/:id', auth, [
  body('route.name').optional().notEmpty().withMessage('Route name cannot be empty'),
  body('transport.mode').optional().isIn(['truck', 'train', 'ship', 'plane', 'electric_vehicle', 'bicycle', 'walking'])
    .withMessage('Valid transport mode is required'),
  body('emissions.current.value').optional().isNumeric().withMessage('Current emissions must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const route = await Logistics.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!route) {
      return res.status(404).json({
        error: 'Logistics route not found'
      });
    }

    // Update route data
    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy' && key !== '_id') {
        route[key] = req.body[key];
      }
    });

    // Recalculate savings
    if (route.emissions.alternative.value) {
      route.calculateEmissionsSavings();
    }
    if (route.costs.alternative.value) {
      route.calculateCostSavings();
    }
    
    await route.save();

    res.json({
      message: 'Logistics route updated successfully',
      route
    });

  } catch (error) {
    console.error('Update logistics route error:', error);
    res.status(500).json({
      error: 'Failed to update logistics route',
      message: error.message
    });
  }
});

// Delete logistics route
router.delete('/:id', auth, async (req, res) => {
  try {
    const route = await Logistics.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!route) {
      return res.status(404).json({
        error: 'Logistics route not found'
      });
    }

    res.json({
      message: 'Logistics route deleted successfully'
    });

  } catch (error) {
    console.error('Delete logistics route error:', error);
    res.status(500).json({
      error: 'Failed to delete logistics route',
      message: error.message
    });
  }
});

// Get emissions analytics
router.get('/analytics/emissions', auth, async (req, res) => {
  try {
    const routes = await Logistics.find({ createdBy: req.user._id });
    
    const analytics = {
      totalRoutes: routes.length,
      totalEmissions: 0,
      totalSaved: 0,
      totalCost: 0,
      totalCostSaved: 0,
      modeBreakdown: {},
      monthlyEmissions: {},
      optimizationOpportunities: []
    };

    if (routes.length > 0) {
      routes.forEach(route => {
        analytics.totalEmissions += route.emissions.current.value;
        analytics.totalSaved += route.emissions.saved.value;
        analytics.totalCost += route.costs.current.value || 0;
        analytics.totalCostSaved += route.costs.savings.value || 0;
        
        // Mode breakdown
        const mode = route.transport.mode;
        if (!analytics.modeBreakdown[mode]) {
          analytics.modeBreakdown[mode] = {
            count: 0,
            totalEmissions: 0,
            totalSaved: 0
          };
        }
        analytics.modeBreakdown[mode].count++;
        analytics.modeBreakdown[mode].totalEmissions += route.emissions.current.value;
        analytics.modeBreakdown[mode].totalSaved += route.emissions.saved.value;
        
        // Monthly emissions
        const month = new Date(route.createdAt).toISOString().slice(0, 7);
        if (!analytics.monthlyEmissions[month]) {
          analytics.monthlyEmissions[month] = 0;
        }
        analytics.monthlyEmissions[month] += route.emissions.current.value;
        
        // Optimization opportunities
        if (route.emissions.saved.value > 0) {
          analytics.optimizationOpportunities.push({
            routeId: route._id,
            routeName: route.route.name,
            potentialSavings: route.emissions.saved.value,
            costSavings: route.costs.savings.value || 0
          });
        }
      });
      
      // Sort optimization opportunities by potential savings
      analytics.optimizationOpportunities.sort((a, b) => b.potentialSavings - a.potentialSavings);
    }

    res.json({ analytics });

  } catch (error) {
    console.error('Get emissions analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch emissions analytics',
      message: error.message
    });
  }
});

// Add optimization suggestion
router.post('/:id/optimization', auth, [
  body('type').isIn(['route_change', 'mode_change', 'vehicle_upgrade', 'schedule_optimization'])
    .withMessage('Valid optimization type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('potentialSavings.emissions').isNumeric().withMessage('Potential emissions savings must be a number'),
  body('potentialSavings.cost').isNumeric().withMessage('Potential cost savings must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const route = await Logistics.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!route) {
      return res.status(404).json({
        error: 'Logistics route not found'
      });
    }

    route.optimization.suggestions.push(req.body);
    await route.save();

    res.json({
      message: 'Optimization suggestion added successfully',
      route
    });

  } catch (error) {
    console.error('Add optimization error:', error);
    res.status(500).json({
      error: 'Failed to add optimization suggestion',
      message: error.message
    });
  }
});

// Implement optimization
router.post('/:id/implement-optimization', auth, [
  body('suggestionIndex').isNumeric().withMessage('Suggestion index is required'),
  body('actualSavings.emissions').isNumeric().withMessage('Actual emissions savings must be a number'),
  body('actualSavings.cost').isNumeric().withMessage('Actual cost savings must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const route = await Logistics.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!route) {
      return res.status(404).json({
        error: 'Logistics route not found'
      });
    }

    const suggestionIndex = parseInt(req.body.suggestionIndex);
    if (suggestionIndex < 0 || suggestionIndex >= route.optimization.suggestions.length) {
      return res.status(400).json({
        error: 'Invalid suggestion index'
      });
    }

    const suggestion = route.optimization.suggestions[suggestionIndex];
    
    // Move suggestion to implemented
    route.optimization.implemented.push({
      type: suggestion.type,
      description: suggestion.description,
      implementedDate: new Date(),
      actualSavings: req.body.actualSavings
    });
    
    // Remove from suggestions
    route.optimization.suggestions.splice(suggestionIndex, 1);
    
    await route.save();

    res.json({
      message: 'Optimization implemented successfully',
      route
    });

  } catch (error) {
    console.error('Implement optimization error:', error);
    res.status(500).json({
      error: 'Failed to implement optimization',
      message: error.message
    });
  }
});

module.exports = router; 