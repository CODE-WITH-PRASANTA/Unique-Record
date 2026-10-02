const Category = require('../models/categoryModel');

const getCategories = async (req, res) => {
  try {
    const { type, search, format } = req.query;
    let query = {};
    if (type && type !== 'All') {
      query.type = type;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const categories = await Category.find(query).sort({ name: 1 });

    if (format === 'array') {
      return res.status(200).json(categories);
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories',
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public / Admin
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
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

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public / Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name',
      });
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating category',
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Public / Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name',
      });
    }

    // Check if another category with same name exists
    const duplicate = await Category.findOne({
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const updateData = {
      name: name.trim(),
      slug: name
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-'),
    };

    if (description !== undefined) updateData.description = description.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating category',
    });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Public / Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting category',
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
