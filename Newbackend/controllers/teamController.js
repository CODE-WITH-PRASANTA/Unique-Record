const Team = require('../models/teamModel');
const path = require('path');
const fs = require('fs');

// Helper to remove image file from disk
const removeFileIfExists = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  try {
    const filename = path.basename(fileUrl);
    const filepath = path.join(__dirname, '..', 'upload', 'team', filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (err) {
    console.error('Error deleting team photo file:', err);
  }
};

// @desc    Get all active team members (Public)
// @route   GET /api/teams
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'Active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await Team.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching team members',
    });
  }
};

// @desc    Get all team members for Admin
// @route   GET /api/teams/all
// @access  Admin / Public
const getAllTeamMembersAdmin = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await Team.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error('Error fetching all team members for admin:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all team members',
    });
  }
};

// @desc    Get single team member by ID
// @route   GET /api/teams/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching team member',
    });
  }
};

// @desc    Create new team member
// @route   POST /api/teams
// @access  Admin
const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      designation,
      phone,
      email,
      profilePic,
      facebook,
      instagram,
      twitter,
      linkedin,
      status,
      order,
    } = req.body;

    if (!name || !designation || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, designation, phone, and email are required fields.',
      });
    }

    const newMember = await Team.create({
      name,
      designation,
      phone,
      email,
      profilePic: profilePic || '',
      facebook: facebook || '',
      instagram: instagram || '',
      twitter: twitter || '',
      linkedin: linkedin || '',
      status: status || 'Active',
      order: order ? Number(order) : 0,
    });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: newMember,
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating team member',
    });
  }
};

// @desc    Update team member
// @route   PUT /api/teams/:id
// @access  Admin
const updateTeamMember = async (req, res) => {
  try {
    let member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    const {
      name,
      designation,
      phone,
      email,
      profilePic,
      facebook,
      instagram,
      twitter,
      linkedin,
      status,
      order,
    } = req.body;

    if (profilePic && member.profilePic && profilePic !== member.profilePic) {
      removeFileIfExists(member.profilePic);
    }

    member.name = name || member.name;
    member.designation = designation || member.designation;
    member.phone = phone || member.phone;
    member.email = email || member.email;
    if (profilePic !== undefined) member.profilePic = profilePic;
    if (facebook !== undefined) member.facebook = facebook;
    if (instagram !== undefined) member.instagram = instagram;
    if (twitter !== undefined) member.twitter = twitter;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (status !== undefined) member.status = status;
    if (order !== undefined) member.order = Number(order);

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: member,
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating team member',
    });
  }
};

// @desc    Toggle team member active status
// @route   PATCH /api/teams/:id/status
// @access  Admin
const toggleTeamStatus = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    member.status = member.status === 'Active' ? 'Inactive' : 'Active';
    await member.save();

    res.status(200).json({
      success: true,
      message: `Team member status set to ${member.status}`,
      status: member.status,
      data: member,
    });
  } catch (error) {
    console.error('Error toggling team member status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating team member status',
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/teams/:id
// @access  Admin
const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    if (member.profilePic) {
      removeFileIfExists(member.profilePic);
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting team member',
    });
  }
};

module.exports = {
  getTeamMembers,
  getAllTeamMembersAdmin,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  toggleTeamStatus,
  deleteTeamMember,
};
