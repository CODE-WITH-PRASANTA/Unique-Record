const EventCategory = require('../models/eventCategoryModel');

// @desc    Create a new event category
// @route   POST /api/event-categories
// @access  Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const trimmedName = name.trim();
    const existing = await EventCategory.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An event category with this name already exists',
      });
    }

    const newCategory = await EventCategory.create({
      name: trimmedName,
      description: (description || '').trim(),
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Event category created successfully! 🎉',
      data: newCategory,
    });
  } catch (error) {
    console.error('Error creating event category:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating event category',
    });
  }
};

// @desc    Get all event categories
// @route   GET /api/event-categories
// @access  Public / Admin
const getAllCategories = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const categories = await EventCategory.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching event categories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching event categories',
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/event-categories/:id
// @access  Public / Admin
const getCategoryById = async (req, res) => {
  try {
    const category = await EventCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Event category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching category',
    });
  }
};

// @desc    Update category
// @route   PUT /api/event-categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const category = await EventCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Event category not found',
      });
    }

    if (name && name.trim()) {
      const trimmedName = name.trim();
      const existing = await EventCategory.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Another category with this name already exists',
        });
      }
      category.name = trimmedName;
    }

    if (description !== undefined) category.description = description.trim();
    if (status) category.status = status;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Event category updated successfully! 🎉',
      data: category,
    });
  } catch (error) {
    console.error('Error updating event category:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating event category',
    });
  }
};

// @desc    Toggle category status
// @route   PATCH /api/event-categories/:id/status
// @access  Admin
const updateCategoryStatus = async (req, res) => {
  try {
    const category = await EventCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Event category not found',
      });
    }

    category.status = category.status === 'Active' ? 'Inactive' : 'Active';
    await category.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${category.status}`,
      data: category,
    });
  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling status',
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/event-categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await EventCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Event category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting category',
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};
