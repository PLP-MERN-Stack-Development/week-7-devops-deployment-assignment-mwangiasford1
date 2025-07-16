const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// GET all items (with search and filtering)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      q, // search query
      category,
      priority,
      completed,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20,
      page = 1
    } = req.query;

    const userId = req.user ? req.user._id : null;
    const skip = (page - 1) * limit;

    const options = {
      category,
      priority,
      completed: completed === 'true' ? true : completed === 'false' ? false : undefined,
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      skip
    };

    let items;
    let total;

    if (q) {
      // Use search method
      items = await Item.search(q, userId, options);
      total = await Item.countDocuments({
        $text: { $search: q },
        $or: [
          { user: userId },
          { isPublic: true }
        ]
      });
    } else {
      // Use regular find
      let query = {
        $or: [
          { user: userId },
          { isPublic: true }
        ]
      };

      if (category) query.category = category;
      if (priority) query.priority = priority;
      if (completed !== undefined) query.completed = completed === 'true';

      items = await Item.find(query)
        .populate('user', 'username firstName lastName')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .limit(parseInt(limit))
        .skip(skip);

      total = await Item.countDocuments(query);
    }

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single item by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user', 'username firstName lastName');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user can access this item
    const userId = req.user ? req.user._id : null;
    if (!item.isPublic && (!userId || item.user._id.toString() !== userId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST new item (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      user: req.user._id
    };

    const item = new Item(itemData);
    const newItem = await item.save();
    
    await newItem.populate('user', 'username firstName lastName');
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update item (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    const updateFields = ['title', 'description', 'completed', 'category', 'priority', 'dueDate', 'tags', 'isPublic'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    const updatedItem = await item.save();
    await updatedItem.populate('user', 'username firstName lastName');
    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE item (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET item statistics (requires authentication)
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const stats = await Item.getStats(req.user._id);
    res.json(stats[0] || { total: 0, completed: 0, pending: 0, overdue: 0 });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET categories (requires authentication)
router.get('/categories/list', authenticateToken, async (req, res) => {
  try {
    const categories = await Item.distinct('category', {
      $or: [
        { user: req.user._id },
        { isPublic: true }
      ]
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET items by category (requires authentication)
router.get('/categories/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const { sortBy = 'createdAt', sortOrder = 'desc', limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      category,
      $or: [
        { user: req.user._id },
        { isPublic: true }
      ]
    };

    const items = await Item.find(query)
      .populate('user', 'username firstName lastName')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get items by category error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 