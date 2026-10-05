const mongoose = require('mongoose');
const AchievementComment = require('../models/achievementCommentModel');

// @desc    Submit feedback/comment from frontend (Defaults to Draft)
// @route   POST /api/comment/feedback, POST /api/comments/achievement, POST /api/comments
// @access  Public
const submitFeedback = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      address,
      message,
      achievementId,
      achievementTitle,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Feedback message is required',
      });
    }

    let validAchId = undefined;
    if (achievementId && mongoose.Types.ObjectId.isValid(achievementId)) {
      validAchId = achievementId;
    }

    const newComment = await AchievementComment.create({
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'Achievement Feedback').trim(),
      address: (address || '').trim(),
      message: message.trim(),
      achievementId: validAchId,
      achievementTitle: (achievementTitle || '').trim(),
      status: 'Draft', // Saved as Draft as requested
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! It has been received and saved as Draft for admin review.',
      data: newComment,
    });
  } catch (error) {
    console.error('Error submitting feedback comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting feedback',
    });
  }
};

// @desc    Get published / approved comments for Frontend Sidebar
// @route   GET /api/comment/feedbacks, GET /api/comments/approved
// @access  Public
const getApprovedFeedbacks = async (req, res) => {
  try {
    const { achievementId, format } = req.query;
    let query = { status: 'Approved' };

    if (achievementId && mongoose.Types.ObjectId.isValid(achievementId)) {
      query.achievementId = achievementId;
    }

    const comments = await AchievementComment.find(query).sort({ createdAt: -1 });

    // Return direct array for frontend compatibility
    if (format === 'object') {
      return res.status(200).json({
        success: true,
        count: comments.length,
        data: comments,
      });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching approved comments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching feedbacks',
    });
  }
};

// @desc    Get all comments for Admin Panel (Draft, Approved, Rejected)
// @route   GET /api/comments/achievements, GET /api/comments/all
// @access  Admin / Public
const getAllAchievementComments = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const comments = await AchievementComment.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching admin achievement comments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching comments',
    });
  }
};

// @desc    Get comment by ID
// @route   GET /api/comments/:id
// @access  Public / Admin
const getCommentById = async (req, res) => {
  try {
    const comment = await AchievementComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching comment',
    });
  }
};

// @desc    Update comment status (Draft / Approved / Rejected)
// @route   PATCH /api/comments/:id/status
// @access  Admin
const updateCommentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const comment = await AchievementComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    if (status) {
      comment.status = status;
    } else {
      // Toggle logic
      comment.status = comment.status === 'Approved' ? 'Draft' : 'Approved';
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: `Comment status updated to ${comment.status}`,
      data: comment,
    });
  } catch (error) {
    console.error('Error updating comment status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating comment status',
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Admin
const deleteComment = async (req, res) => {
  try {
    const comment = await AchievementComment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting comment',
    });
  }
};

module.exports = {
  submitFeedback,
  getApprovedFeedbacks,
  getAllAchievementComments,
  getCommentById,
  updateCommentStatus,
  deleteComment,
};
