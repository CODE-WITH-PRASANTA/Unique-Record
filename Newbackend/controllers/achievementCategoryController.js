const AchievementCategory = require('../models/achievementCategoryModel');

// @desc    Get all achievement categories
// @route   GET /api/achievement-categories
// @access  Public / Admin
const getAchievementCategories = async (req, res) => {
  try {
    const { status, search, format } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const categories = await AchievementCategory.find(query).sort({ name: 1 });

    if (format === 'array') {
      return res.status(200).json(categories);
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching achievement categories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching achievement categories',
    });
  }
};

// @desc    Get single achievement category by ID
// @route   GET /api/achievement-categories/:id
// @access  Public / Admin
const getAchievementCategoryById = async (req, res) => {
  try {
    const category = await AchievementCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Achievement category not found',
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching achievement category',
    });
  }
};

// @desc    Create a new achievement category
// @route   POST /api/achievement-categories
// @access  Admin
const createAchievementCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const trimmedName = name.trim();

    const exists = await AchievementCategory.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Achievement category with this name already exists',
      });
    }

    const newCategory = await AchievementCategory.create({
      name: trimmedName,
      description: description ? description.trim() : '',
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Achievement category created successfully',
      data: newCategory,
    });
  } catch (error) {
    console.error('Error creating achievement category:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating achievement category',
    });
  }
};

// @desc    Update an achievement category
// @route   PUT /api/achievement-categories/:id
// @access  Admin
const updateAchievementCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const trimmedName = name.trim();

    // Check duplicate with another ID
    const duplicate = await AchievementCategory.findOne({
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'Achievement category with this name already exists',
      });
    }

    const updateData = {
      name: trimmedName,
      slug: trimmedName
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-'),
    };

    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;

    const updatedCategory = await AchievementCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Achievement category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    console.error('Error updating achievement category:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating achievement category',
    });
  }
};

// @desc    Delete an achievement category
// @route   DELETE /api/achievement-categories/:id
// @access  Admin
const deleteAchievementCategory = async (req, res) => {
  try {
    const category = await AchievementCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Achievement category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting achievement category:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting achievement category',
    });
  }
};

// @desc    Toggle category status
// @route   PATCH /api/achievement-categories/:id/status
// @access  Admin
const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await AchievementCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Achievement category not found',
      });
    }

    category.status = category.status === 'Active' ? 'Inactive' : 'Active';
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category is now ${category.status}`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling category status',
    });
  }
};

module.exports = {
  getAchievementCategories,
  getAchievementCategoryById,
  createAchievementCategory,
  updateAchievementCategory,
  deleteAchievementCategory,
  toggleCategoryStatus,
};
