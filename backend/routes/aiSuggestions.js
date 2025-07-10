const express = require('express');
const { auth } = require('../middleware/auth');
const AiSuggestion = require('../models/AiSuggestion');

const router = express.Router();

// Get personalized AI suggestions
router.get('/personalized', auth, async (req, res) => {
  try {
    const suggestions = await AiSuggestion.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      suggestions,
      totalSuggestions: suggestions.length
    });

  } catch (error) {
    console.error('Get AI suggestions error:', error);
    res.status(500).json({
      error: 'Failed to fetch AI suggestions',
      message: error.message
    });
  }
});

// Generate new AI suggestions
router.post('/generate', auth, async (req, res) => {
  try {
    const { count = 5 } = req.body;
    
    // Generate new suggestions using the model's static method
    const suggestions = await AiSuggestion.generateSuggestions(req.user._id, count);
    
    res.json({
      suggestions,
      message: `Generated ${suggestions.length} new suggestions`
    });

  } catch (error) {
    console.error('Generate AI suggestions error:', error);
    res.status(500).json({
      error: 'Failed to generate AI suggestions',
      message: error.message
    });
  }
});

// Mark suggestion as implemented
router.put('/:id/implement', auth, async (req, res) => {
  try {
    const suggestion = await AiSuggestion.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!suggestion) {
      return res.status(404).json({
        error: 'Suggestion not found'
      });
    }
    
    await suggestion.markAsImplemented(req.body);
    
    res.json({
      suggestion,
      message: 'Suggestion marked as implemented'
    });

  } catch (error) {
    console.error('Mark implemented error:', error);
    res.status(500).json({
      error: 'Failed to mark suggestion as implemented',
      message: error.message
    });
  }
});

// Mark suggestion as rejected
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const suggestion = await AiSuggestion.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!suggestion) {
      return res.status(404).json({
        error: 'Suggestion not found'
      });
    }
    
    await suggestion.markAsRejected(req.body.reason);
    
    res.json({
      suggestion,
      message: 'Suggestion marked as rejected'
    });

  } catch (error) {
    console.error('Mark rejected error:', error);
    res.status(500).json({
      error: 'Failed to mark suggestion as rejected',
      message: error.message
    });
  }
});

// Get suggestions by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    
    const suggestions = await AiSuggestion.find({ 
      userId: req.user._id,
      category: category 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
    
    res.json({
      category,
      suggestions,
      totalSuggestions: suggestions.length
    });

  } catch (error) {
    console.error('Get category suggestions error:', error);
    res.status(500).json({
      error: 'Failed to fetch category suggestions',
      message: error.message
    });
  }
});

// Get all available categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = [
      'Waste Reduction',
      'Energy Efficiency', 
      'Supply Chain',
      'Packaging',
      'Transportation',
      'Water Conservation',
      'Employee Training',
      'Technology'
    ];
    
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await AiSuggestion.countDocuments({ 
          userId: req.user._id,
          category 
        });
        return {
          name: category,
          suggestionCount: count
        };
      })
    );
    
    res.json({ categories: categoryStats });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// Get suggestion statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await AiSuggestion.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          implemented: { 
            $sum: { $cond: [{ $eq: ['$status', 'implemented'] }, 1, 0] }
          },
          rejected: { 
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          pending: { 
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const categoryStats = await AiSuggestion.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      stats: stats[0] || {
        total: 0,
        implemented: 0,
        rejected: 0,
        pending: 0,
        highPriority: 0
      },
      categoryStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

module.exports = router; 