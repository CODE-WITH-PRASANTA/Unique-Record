const Gallery = require('../models/galleryModel');
const path = require('path');
const fs = require('fs');

// Helper to remove image file from disk
const removeFileIfExists = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  try {
    const filename = path.basename(fileUrl);
    const filepath = path.join(__dirname, '..', 'upload', 'gallery', filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (err) {
    console.error('Error deleting gallery photo file:', err);
  }
};

// @desc    Get all active gallery items (Public / Frontend)
// @route   GET /api/gallery, GET /api/eventsgalary
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'Active' };

    if (category && category !== 'All' && category !== 'All Photos') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { instagram: { $regex: search, $options: 'i' } },
        { facebook: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching gallery items',
    });
  }
};

// @desc    Get all gallery items for Admin
// @route   GET /api/gallery/all, GET /api/eventsgalary/all
// @access  Admin / Public
const getAllGalleryAdmin = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All' && category !== 'All Photos') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { instagram: { $regex: search, $options: 'i' } },
        { facebook: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching all gallery items for admin:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching gallery items',
    });
  }
};

// @desc    Get single gallery item by ID
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching gallery item',
    });
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery, POST /api/eventsgalary, POST /api/eventsgalary/upload
// @access  Admin / Public
const createGalleryItem = async (req, res) => {
  try {
    const {
      imageUrl,
      photoUrl,
      instagram,
      facebook,
      category,
      status,
    } = req.body;

    const finalImage = imageUrl || photoUrl;

    if (!finalImage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide or upload a gallery photo.',
      });
    }

    const newItem = await Gallery.create({
      imageUrl: finalImage,
      photoUrl: finalImage,
      instagram: instagram || '',
      facebook: facebook || '',
      category: category || 'Events',
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating gallery item',
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Admin
const updateGalleryItem = async (req, res) => {
  try {
    let item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    const {
      imageUrl,
      photoUrl,
      instagram,
      facebook,
      category,
      status,
    } = req.body;

    const newImage = imageUrl || photoUrl;

    if (newImage && item.imageUrl && newImage !== item.imageUrl) {
      removeFileIfExists(item.imageUrl);
    }

    if (newImage) {
      item.imageUrl = newImage;
      item.photoUrl = newImage;
    }
    if (instagram !== undefined) item.instagram = instagram;
    if (facebook !== undefined) item.facebook = facebook;
    if (category !== undefined) item.category = category;
    if (status !== undefined) item.status = status;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating gallery item',
    });
  }
};

// @desc    Toggle gallery item status
// @route   PATCH /api/gallery/:id/status
// @access  Admin
const toggleGalleryStatus = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    await item.save();

    res.status(200).json({
      success: true,
      message: `Gallery item status set to ${item.status}`,
      status: item.status,
      data: item,
    });
  } catch (error) {
    console.error('Error toggling gallery status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating gallery status',
    });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id, DELETE /api/eventsgalary/:id
// @access  Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    if (item.imageUrl) {
      removeFileIfExists(item.imageUrl);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting gallery item',
    });
  }
};

module.exports = {
  getGalleryItems,
  getAllGalleryAdmin,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  toggleGalleryStatus,
  deleteGalleryItem,
};
