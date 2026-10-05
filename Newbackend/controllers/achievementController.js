const mongoose = require('mongoose');
const Achievement = require('../models/achievementModel');
const path = require('path');
const fs = require('fs');

// Helper to remove image file from disk
const removeFileIfExists = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  try {
    const filename = path.basename(fileUrl);
    const filepath = path.join(__dirname, '..', 'upload', 'achievements', filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (err) {
    console.error('Error deleting achievement image file:', err);
  }
};

// Helper to parse tags safely
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not JSON
    }
    return tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

// @desc    Get published achievements (Public / Frontend)
// @route   GET /api/achievements, GET /api/achievements/get-published-achievements, GET /api/achievements/published
// @access  Public
const getPublishedAchievements = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { $or: [{ isPublished: true }, { status: 'Published' }] };

    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { achieverName: { $regex: search, $options: 'i' } },
        { providerName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { shortDesc: { $regex: search, $options: 'i' } },
      ];
    }

    const achievements = await Achievement.find(query).sort({ createdAt: -1 });

    // Return direct array for frontend compatibility
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching published achievements:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching achievements',
    });
  }
};

// @desc    Get all achievements (Admin & API)
// @route   GET /api/achievements/all, GET /api/achievements/get-all-achievements
// @access  Public / Admin
const getAllAchievements = async (req, res) => {
  try {
    const { category, search, format } = req.query;
    let query = {};

    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { achieverName: { $regex: search, $options: 'i' } },
        { providerName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const achievements = await Achievement.find(query).sort({ createdAt: -1 });

    // If caller requests standard object or legacy array
    if (format === 'object') {
      return res.status(200).json({
        success: true,
        count: achievements.length,
        data: achievements,
      });
    }

    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching all achievements:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching achievements',
    });
  }
};

// @desc    Get single achievement by ID
// @route   GET /api/achievements/:id, GET /api/achievements/get-achievement/:id
// @access  Public
const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    let achievement = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      achievement = await Achievement.findById(id);
    }

    if (!achievement) {
      achievement = await Achievement.findOne({ slug: id.toLowerCase().trim() });
    }

    if (!achievement && typeof id === 'string') {
      const normalized = id.replace(/-/g, ' ').trim();
      achievement = await Achievement.findOne({
        $or: [
          { title: { $regex: new RegExp(`^${normalized}$`, 'i') } },
          { achieverName: { $regex: new RegExp(`^${normalized}$`, 'i') } },
        ],
      });
    }

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    res.status(200).json(achievement);
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching achievement',
    });
  }
};

// @desc    Create / Post new achievement
// @route   POST /api/achievements, POST /api/achievements/post, POST /api/achievements/create
// @access  Admin / Public
const postAchievement = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      shortDesc,
      content,
      providerName,
      achieverName,
      category,
      effortType,
      address,
      uruHolderLink,
      holderLink,
      tags,
      image,
      imageUrl,
      isPublished,
      status,
    } = req.body;

    const finalTitle = (title || '').trim();
    const finalAchiever = (achieverName || '').trim();
    const finalShortDesc = (shortDescription || shortDesc || '').trim();
    const finalHolderLink = (uruHolderLink || holderLink || '').trim();
    const finalImage = req.uploadedWebp || image || imageUrl || '';

    if (!finalTitle) {
      return res.status(400).json({
        success: false,
        message: 'Achievement Title is required',
      });
    }

    if (!finalAchiever) {
      return res.status(400).json({
        success: false,
        message: 'Achiever Name is required',
      });
    }

    const parsedTags = parseTags(tags);

    const newAchievement = await Achievement.create({
      title: finalTitle,
      shortDescription: finalShortDesc,
      shortDesc: finalShortDesc,
      content: content || '',
      providerName: (providerName || 'Unique Record').trim(),
      achieverName: finalAchiever,
      category: (category || 'General').trim(),
      effortType: (effortType || 'Individual').trim(),
      address: (address || '').trim(),
      uruHolderLink: finalHolderLink,
      holderLink: finalHolderLink,
      tags: parsedTags,
      image: finalImage,
      imageUrl: finalImage,
      isPublished: typeof isPublished === 'boolean' ? isPublished : true,
      status: status || 'Published',
    });

    res.status(201).json({
      success: true,
      message: 'Achievement posted successfully',
      data: newAchievement,
      achievement: newAchievement,
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error posting achievement',
    });
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id, PUT /api/achievements/update/:id
// @access  Admin / Public
const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Achievement ID',
      });
    }

    let achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    const {
      title,
      shortDescription,
      shortDesc,
      content,
      providerName,
      achieverName,
      category,
      effortType,
      address,
      uruHolderLink,
      holderLink,
      tags,
      image,
      imageUrl,
      isPublished,
      status,
    } = req.body;

    const newImage = req.uploadedWebp || image || imageUrl;

    if (newImage && achievement.image && newImage !== achievement.image) {
      removeFileIfExists(achievement.image);
    }

    if (title !== undefined) achievement.title = title.trim();
    if (shortDescription !== undefined || shortDesc !== undefined) {
      const desc = (shortDescription || shortDesc || '').trim();
      achievement.shortDescription = desc;
      achievement.shortDesc = desc;
    }
    if (content !== undefined) achievement.content = content;
    if (providerName !== undefined) achievement.providerName = providerName.trim();
    if (achieverName !== undefined) achievement.achieverName = achieverName.trim();
    if (category !== undefined) achievement.category = category.trim();
    if (effortType !== undefined) achievement.effortType = effortType.trim();
    if (address !== undefined) achievement.address = address.trim();
    if (uruHolderLink !== undefined || holderLink !== undefined) {
      const link = (uruHolderLink || holderLink || '').trim();
      achievement.uruHolderLink = link;
      achievement.holderLink = link;
    }
    if (tags !== undefined) {
      achievement.tags = parseTags(tags);
    }
    if (newImage) {
      achievement.image = newImage;
      achievement.imageUrl = newImage;
    }
    if (isPublished !== undefined) achievement.isPublished = Boolean(isPublished);
    if (status !== undefined) achievement.status = status;

    await achievement.save();

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement,
      achievement,
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating achievement',
    });
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/achievements/:id/publish, PATCH /api/achievements/:id/status
// @access  Admin / Public
const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    achievement.isPublished = !achievement.isPublished;
    achievement.status = achievement.isPublished ? 'Published' : 'Draft';
    await achievement.save();

    res.status(200).json({
      success: true,
      message: `Achievement ${achievement.isPublished ? 'published' : 'unpublished'} successfully`,
      data: achievement,
      achievement,
    });
  } catch (error) {
    console.error('Error toggling achievement publish state:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling publish state',
    });
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id, DELETE /api/achievements/delete/:id
// @access  Admin / Public
const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Achievement ID',
      });
    }

    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    if (achievement.image) {
      removeFileIfExists(achievement.image);
    }

    await Achievement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting achievement',
    });
  }
};

module.exports = {
  getPublishedAchievements,
  getAllAchievements,
  getAchievementById,
  postAchievement,
  updateAchievement,
  togglePublish,
  deleteAchievement,
};
