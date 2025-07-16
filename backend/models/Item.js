const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'education', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
itemSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Virtual for overdue status
itemSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Virtual for days until due
itemSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are included in JSON output
itemSchema.set('toJSON', { virtuals: true });

// Static method for search
itemSchema.statics.search = function(query, userId, options = {}) {
  const {
    category,
    priority,
    completed,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 20,
    skip = 0
  } = options;

  let searchQuery = {};

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // User filter (show user's items + public items)
  searchQuery.$or = [
    { user: userId },
    { isPublic: true }
  ];

  // Category filter
  if (category) {
    searchQuery.category = category;
  }

  // Priority filter
  if (priority) {
    searchQuery.priority = priority;
  }

  // Completion filter
  if (completed !== undefined) {
    searchQuery.completed = completed;
  }

  return this.find(searchQuery)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'username firstName lastName');
};

// Static method for getting statistics
itemSchema.statics.getStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { user: mongoose.Types.ObjectId(userId) },
          { isPublic: true }
        ]
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ['$completed', 1, 0] }
        },
        pending: {
          $sum: { $cond: ['$completed', 0, 1] }
        },
        overdue: {
          $sum: {
            $cond: [
              { $and: ['$dueDate', { $gt: ['$dueDate', new Date()] }, { $not: '$completed' }] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Item', itemSchema); 