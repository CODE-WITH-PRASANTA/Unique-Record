const mongoose = require('mongoose');
const UserOpinion = require('../models/userOpinionModel');

// @desc    Submit user opinion / contact form (Defaults to Draft)
// @route   POST /api/contact, POST /api/user-opinions, POST /api/freequotes/create, POST /api/opinions
// @access  Public
const createOpinion = async (req, res) => {
  try {
    const { name, email, phone, age, designation, address, subject, message } = req.body;

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
        message: 'Message is required',
      });
    }

    const newOpinion = await UserOpinion.create({
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      age: (age || '').toString().trim(),
      designation: (designation || '').trim(),
      address: (address || '').trim(),
      subject: (subject || 'Contact Inquiry').trim(),
      message: message.trim(),
      status: 'Draft', // Saved initially as Draft for Admin Review
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      message: 'Form Submitted Successfully ✅',
      data: newOpinion,
    });
  } catch (error) {
    console.error('Error submitting user opinion/contact:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting contact form',
    });
  }
};

// @desc    Get all opinions for Admin Panel (Draft, Approved, Rejected)
// @route   GET /api/user-opinions, GET /api/opinions, GET /api/freequotes
// @access  Admin / Public
const getAllOpinions = async (req, res) => {
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
        { phone: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const opinions = await UserOpinion.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opinions.length,
      data: opinions,
    });
  } catch (error) {
    console.error('Error fetching opinions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching opinions',
    });
  }
};

// @desc    Get approved opinions for public website
// @route   GET /api/user-opinions/approved, GET /api/opinions/approved
// @access  Public
const getApprovedOpinions = async (req, res) => {
  try {
    const query = {
      $or: [{ status: 'Approved' }, { isPublished: true }],
    };

    const opinions = await UserOpinion.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opinions.length,
      data: opinions,
    });
  } catch (error) {
    console.error('Error fetching approved opinions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching approved opinions',
    });
  }
};

// @desc    Get single opinion by ID
// @route   GET /api/user-opinions/:id, GET /api/opinions/:id
// @access  Admin / Public
const getOpinionById = async (req, res) => {
  try {
    const opinion = await UserOpinion.findById(req.params.id);
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found',
      });
    }

    res.status(200).json({
      success: true,
      data: opinion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching opinion',
    });
  }
};

// @desc    Update opinion status (Draft ↔ Approved)
// @route   PATCH /api/user-opinions/:id/status, PUT /api/freequotes/:id/publish
// @access  Admin
const updateOpinionStatus = async (req, res) => {
  try {
    const { status, isPublished } = req.body;
    const opinion = await UserOpinion.findById(req.params.id);

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found',
      });
    }

    if (status) {
      opinion.status = status;
      opinion.isPublished = status === 'Approved';
    } else if (isPublished !== undefined) {
      opinion.isPublished = Boolean(isPublished);
      opinion.status = isPublished ? 'Approved' : 'Draft';
    } else {
      // Toggle logic
      const isCurrentlyApproved = opinion.status === 'Approved' || opinion.isPublished === true;
      opinion.status = isCurrentlyApproved ? 'Draft' : 'Approved';
      opinion.isPublished = !isCurrentlyApproved;
    }

    await opinion.save();

    res.status(200).json({
      success: true,
      message: `Opinion status updated to ${opinion.status}`,
      data: opinion,
    });
  } catch (error) {
    console.error('Error updating opinion status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating opinion status',
    });
  }
};

// @desc    Update opinion details
// @route   PUT /api/user-opinions/:id
// @access  Admin
const updateOpinion = async (req, res) => {
  try {
    const { name, email, phone, age, designation, address, subject, message, status } = req.body;
    const opinion = await UserOpinion.findById(req.params.id);

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found',
      });
    }

    if (name) opinion.name = name.trim();
    if (email) opinion.email = email.trim();
    if (phone !== undefined) opinion.phone = phone.trim();
    if (age !== undefined) opinion.age = age.toString().trim();
    if (designation !== undefined) opinion.designation = designation.trim();
    if (address !== undefined) opinion.address = address.trim();
    if (subject !== undefined) opinion.subject = subject.trim();
    if (message) opinion.message = message.trim();
    if (status) {
      opinion.status = status;
      opinion.isPublished = status === 'Approved';
    }

    await opinion.save();

    res.status(200).json({
      success: true,
      message: 'Opinion updated successfully',
      data: opinion,
    });
  } catch (error) {
    console.error('Error updating opinion:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating opinion',
    });
  }
};

// @desc    Delete opinion
// @route   DELETE /api/user-opinions/:id, DELETE /api/freequotes/:id
// @access  Admin
const deleteOpinion = async (req, res) => {
  try {
    const opinion = await UserOpinion.findByIdAndDelete(req.params.id);
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinion not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Opinion deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting opinion:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting opinion',
    });
  }
};

module.exports = {
  createOpinion,
  getAllOpinions,
  getApprovedOpinions,
  getOpinionById,
  updateOpinionStatus,
  updateOpinion,
  deleteOpinion,
};
