const mongoose = require('mongoose');
const BlogComment = require('../models/blogCommentModel');

// @desc    Submit feedback/comment from individual blog page (Defaults to Draft)
// @route   POST /api/blogcmt/feedback, POST /api/blog-comments/feedback, POST /api/comments/blogs
// @access  Public
const submitBlogFeedback = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      address,
      message,
      blogId,
      blogTitle,
      blogSlug,
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

    let validBlogId = undefined;
    if (blogId && mongoose.Types.ObjectId.isValid(blogId)) {
      validBlogId = blogId;
    }

    const newComment = await BlogComment.create({
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'Blog Feedback').trim(),
      address: (address || '').trim(),
      message: message.trim(),
      blogId: validBlogId,
      blogTitle: (blogTitle || '').trim(),
      blogSlug: (blogSlug || '').trim(),
      status: 'Draft', // Saved as Draft for Admin Review
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: newComment,
    });
  } catch (error) {
    console.error('Error submitting blog feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting blog feedback',
    });
  }
};

// @desc    Get published / approved comments for Frontend Sidebar of a specific blog
// @route   GET /api/blogcmt/feedbacks, GET /api/blog-comments/feedbacks, GET /api/blog-comments/approved
// @access  Public
const getApprovedBlogFeedbacks = async (req, res) => {
  try {
    const { blogId, blogSlug, slug, id } = req.query;
    const targetBlogId = blogId || (id && mongoose.Types.ObjectId.isValid(id) ? id : null);
    const targetSlug = blogSlug || slug;

    let queryConditions = [
      { $or: [{ status: 'Approved' }, { isPublished: true }] },
    ];

    const hasValidId = targetBlogId && mongoose.Types.ObjectId.isValid(targetBlogId);
    const hasSlug = Boolean(targetSlug && targetSlug.trim());

    if (hasValidId && hasSlug) {
      queryConditions.push({
        $or: [
          { blogId: targetBlogId },
          { blogSlug: targetSlug.trim() },
        ],
      });
    } else if (hasValidId) {
      queryConditions.push({ blogId: targetBlogId });
    } else if (hasSlug) {
      queryConditions.push({ blogSlug: targetSlug.trim() });
    }

    const query = queryConditions.length > 1 ? { $and: queryConditions } : queryConditions[0];
    const comments = await BlogComment.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching approved blog comments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching feedbacks',
    });
  }
};

// @desc    Get all blog comments for Admin Panel (Draft, Approved, Rejected)
// @route   GET /api/blogcmt/all-feedbacks, GET /api/blog-comments, GET /api/comments/blogs/all
// @access  Admin / Public
const getAllBlogComments = async (req, res) => {
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
        { blogTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const comments = await BlogComment.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching admin blog comments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching comments',
    });
  }
};

// @desc    Get single blog comment by ID
// @route   GET /api/blogcmt/feedback/:id, GET /api/blog-comments/:id
// @access  Admin / Public
const getBlogCommentById = async (req, res) => {
  try {
    const comment = await BlogComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Blog comment not found',
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

// @desc    Update comment status (Draft ↔ Approved / Rejected)
// @route   PATCH /api/blogcmt/feedback/:id/status, PATCH /api/blogcmt/feedback/:id/toggle, PATCH /api/blog-comments/:id/status
// @access  Admin
const updateBlogCommentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const comment = await BlogComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Blog comment not found',
      });
    }

    if (status) {
      comment.status = status;
      comment.isPublished = status === 'Approved';
    } else {
      // Toggle logic
      const isCurrentlyApproved = comment.status === 'Approved' || comment.isPublished === true;
      comment.status = isCurrentlyApproved ? 'Draft' : 'Approved';
      comment.isPublished = !isCurrentlyApproved;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: `Comment status updated to ${comment.status}`,
      data: comment,
    });
  } catch (error) {
    console.error('Error updating blog comment status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating comment status',
    });
  }
};

// @desc    Update blog comment details
// @route   PUT /api/blogcmt/feedback/:id, PUT /api/blog-comments/:id
// @access  Admin
const updateBlogComment = async (req, res) => {
  try {
    const { name, email, phone, subject, address, message, status } = req.body;
    const comment = await BlogComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Blog comment not found',
      });
    }

    if (name) comment.name = name.trim();
    if (email) comment.email = email.trim();
    if (phone !== undefined) comment.phone = phone.trim();
    if (subject !== undefined) comment.subject = subject.trim();
    if (address !== undefined) comment.address = address.trim();
    if (message) comment.message = message.trim();
    if (status) {
      comment.status = status;
      comment.isPublished = status === 'Approved';
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment,
    });
  } catch (error) {
    console.error('Error updating blog comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating comment',
    });
  }
};

// @desc    Delete blog comment
// @route   DELETE /api/blogcmt/feedback/:id, DELETE /api/blog-comments/:id
// @access  Admin
const deleteBlogComment = async (req, res) => {
  try {
    const comment = await BlogComment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Blog comment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting comment',
    });
  }
};

module.exports = {
  submitBlogFeedback,
  getApprovedBlogFeedbacks,
  getAllBlogComments,
  getBlogCommentById,
  updateBlogCommentStatus,
  updateBlogComment,
  deleteBlogComment,
};
