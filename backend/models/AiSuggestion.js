const mongoose = require('mongoose');

const aiSuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Waste Reduction',
      'Energy Efficiency',
      'Supply Chain',
      'Packaging',
      'Transportation',
      'Water Conservation',
      'Employee Training',
      'Technology'
    ]
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'implemented', 'rejected'],
    default: 'pending'
  },
  impactMetrics: {
    costSavings: {
      type: Number,
      default: 0,
      min: 0
    },
    emissionsReduction: {
      type: Number,
      default: 0,
      min: 0
    },
    wasteReduction: {
      type: Number,
      default: 0,
      min: 0
    },
    implementationEase: {
      type: Number,
      default: 5,
      min: 1,
      max: 10
    }
  },
  implementationDetails: {
    timeRequired: {
      type: String,
      default: '3-6 months'
    },
    resources: {
      type: [String],
      default: []
    },
    steps: {
      type: [String],
      default: []
    },
    estimatedCost: {
      type: Number,
      default: 0
    }
  },
  tags: {
    type: [String],
    default: []
  },
  aiGenerated: {
    type: Boolean,
    default: true
  },
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    implementedDate: {
      type: Date
    },
    rejectionReason: {
      type: String,
      maxlength: 500
    }
  },
  metadata: {
    aiModel: {
      type: String,
      default: 'sustainability-ai-v1'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    generationDate: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
aiSuggestionSchema.index({ userId: 1, status: 1 });
aiSuggestionSchema.index({ category: 1, priority: 1 });
aiSuggestionSchema.index({ createdAt: -1 });

// Virtual for impact score
aiSuggestionSchema.virtual('impactScore').get(function() {
  const { costSavings, emissionsReduction, wasteReduction, implementationEase } = this.impactMetrics;
  const total = (costSavings + emissionsReduction + wasteReduction + implementationEase) / 4;
  return Math.round(total * 10) / 10;
});

// Method to mark as implemented
aiSuggestionSchema.methods.markAsImplemented = function(feedback = {}) {
  this.status = 'implemented';
  this.userFeedback = {
    ...this.userFeedback,
    ...feedback,
    implementedDate: new Date()
  };
  return this.save();
};

// Method to mark as rejected
aiSuggestionSchema.methods.markAsRejected = function(reason) {
  this.status = 'rejected';
  this.userFeedback = {
    ...this.userFeedback,
    rejectionReason: reason
  };
  return this.save();
};

// Static method to generate suggestions
aiSuggestionSchema.statics.generateSuggestions = function(userId, count = 5) {
  const suggestions = [
    {
      title: 'Implement LED Lighting System',
      description: 'Replace traditional lighting with energy-efficient LED bulbs throughout your facility. This can reduce energy consumption by up to 75% and significantly lower electricity costs.',
      category: 'Energy Efficiency',
      priority: 'high',
      impactMetrics: {
        costSavings: 15000,
        emissionsReduction: 25.5,
        wasteReduction: 2.1,
        implementationEase: 7
      },
      implementationDetails: {
        timeRequired: '2-4 months',
        estimatedCost: 5000,
        steps: [
          'Conduct energy audit',
          'Select LED products',
          'Install new lighting',
          'Monitor energy savings'
        ]
      }
    },
    {
      title: 'Switch to Sustainable Packaging',
      description: 'Replace plastic packaging with biodegradable or recyclable alternatives. This reduces waste sent to landfills and improves your brand\'s environmental reputation.',
      category: 'Packaging',
      priority: 'medium',
      impactMetrics: {
        costSavings: 8000,
        emissionsReduction: 12.3,
        wasteReduction: 15.7,
        implementationEase: 6
      },
      implementationDetails: {
        timeRequired: '3-6 months',
        estimatedCost: 3000,
        steps: [
          'Audit current packaging',
          'Research alternatives',
          'Test new materials',
          'Implement changes'
        ]
      }
    },
    {
      title: 'Optimize Delivery Routes',
      description: 'Use route optimization software to reduce fuel consumption and emissions from delivery vehicles. This can save fuel costs and reduce your carbon footprint.',
      category: 'Transportation',
      priority: 'high',
      impactMetrics: {
        costSavings: 12000,
        emissionsReduction: 18.9,
        wasteReduction: 1.2,
        implementationEase: 8
      },
      implementationDetails: {
        timeRequired: '1-3 months',
        estimatedCost: 2000,
        steps: [
          'Analyze current routes',
          'Implement routing software',
          'Train drivers',
          'Monitor results'
        ]
      }
    },
    {
      title: 'Install Water-Saving Fixtures',
      description: 'Replace standard faucets and toilets with low-flow alternatives to reduce water consumption and lower utility bills.',
      category: 'Water Conservation',
      priority: 'medium',
      impactMetrics: {
        costSavings: 5000,
        emissionsReduction: 3.2,
        wasteReduction: 0.8,
        implementationEase: 9
      },
      implementationDetails: {
        timeRequired: '1-2 months',
        estimatedCost: 1500,
        steps: [
          'Audit water usage',
          'Select fixtures',
          'Install new fixtures',
          'Monitor water savings'
        ]
      }
    },
    {
      title: 'Implement Waste Segregation',
      description: 'Set up proper waste segregation systems to improve recycling rates and reduce landfill waste.',
      category: 'Waste Reduction',
      priority: 'medium',
      impactMetrics: {
        costSavings: 6000,
        emissionsReduction: 8.7,
        wasteReduction: 22.3,
        implementationEase: 6
      },
      implementationDetails: {
        timeRequired: '2-4 months',
        estimatedCost: 2500,
        steps: [
          'Design segregation system',
          'Purchase bins',
          'Train staff',
          'Monitor compliance'
        ]
      }
    },
    {
      title: 'Employee Sustainability Training',
      description: 'Conduct regular training sessions to educate employees about sustainability practices and waste reduction techniques.',
      category: 'Employee Training',
      priority: 'low',
      impactMetrics: {
        costSavings: 3000,
        emissionsReduction: 5.1,
        wasteReduction: 8.9,
        implementationEase: 8
      },
      implementationDetails: {
        timeRequired: '1-2 months',
        estimatedCost: 1000,
        steps: [
          'Develop training materials',
          'Schedule sessions',
          'Conduct training',
          'Assess effectiveness'
        ]
      }
    },
    {
      title: 'Install Solar Panels',
      description: 'Install solar panels on your facility roof to generate renewable energy and reduce dependence on grid electricity.',
      category: 'Energy Efficiency',
      priority: 'high',
      impactMetrics: {
        costSavings: 25000,
        emissionsReduction: 45.2,
        wasteReduction: 3.4,
        implementationEase: 4
      },
      implementationDetails: {
        timeRequired: '6-12 months',
        estimatedCost: 15000,
        steps: [
          'Conduct feasibility study',
          'Obtain permits',
          'Install panels',
          'Connect to grid'
        ]
      }
    },
    {
      title: 'Digital Document Management',
      description: 'Implement paperless systems to reduce paper waste and improve operational efficiency.',
      category: 'Technology',
      priority: 'medium',
      impactMetrics: {
        costSavings: 7000,
        emissionsReduction: 6.8,
        wasteReduction: 12.5,
        implementationEase: 7
      },
      implementationDetails: {
        timeRequired: '3-5 months',
        estimatedCost: 4000,
        steps: [
          'Audit paper usage',
          'Select software',
          'Migrate documents',
          'Train staff'
        ]
      }
    }
  ];

  const selectedSuggestions = suggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(suggestion => ({
      ...suggestion,
      userId,
      aiGenerated: true,
      metadata: {
        aiModel: 'sustainability-ai-v1',
        confidence: 0.8 + Math.random() * 0.2,
        generationDate: new Date()
      }
    }));

  return this.insertMany(selectedSuggestions);
};

module.exports = mongoose.model('AiSuggestion', aiSuggestionSchema); 