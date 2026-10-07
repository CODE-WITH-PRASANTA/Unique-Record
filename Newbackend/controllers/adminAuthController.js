const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'unique_record_jwt_secret_key_2026_super_secure';

// Helper to generate JWT Token for Administrators
const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      userId: admin.userId,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Seed default admin if none exists
const seedDefaultAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({
        userId: 'admin',
        email: 'admin@uniquerecord.com',
        name: 'Super Administrator',
        password: 'admin', // Pre-save hook hashes this
        role: 'admin',
      });
      console.log('✅ Default Admin seeded: userId=admin, password=admin');
    }
  } catch (err) {
    console.error('Error seeding default admin:', err.message);
  }
};

// @desc    Admin Login for NewAdminpannel (Authenticates from 'admins' table)
// @route   POST /api/admin/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { userId, username, email, password } = req.body;
    const identifier = (userId || username || email || '').trim().toLowerCase();
    const enteredPassword = password || '';

    if (!identifier || !enteredPassword) {
      return res.status(400).json({
        success: false,
        message: 'Admin User ID / Email and password are required',
      });
    }

    await seedDefaultAdmin();

    // Find admin in 'admins' collection
    let admin = await Admin.findOne({
      $or: [{ userId: identifier }, { email: identifier }],
    });

    if (!admin) {
      if (identifier === 'admin' && enteredPassword === 'admin') {
        admin = await Admin.create({
          userId: 'admin',
          email: 'admin@uniquerecord.com',
          name: 'Super Administrator',
          password: 'admin',
          role: 'admin',
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid Admin User ID or Password',
        });
      }
    }

    // Verify Password
    const isMatch = await admin.matchPassword(enteredPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Admin User ID or Password',
      });
    }

    // Generate JWT Token
    const token = generateAdminToken(admin);

    res.status(200).json({
      success: true,
      message: 'Admin login successful! Welcome back 🎉',
      token,
      user: {
        id: admin._id,
        userId: admin.userId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin login',
    });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/admin/auth/me, GET /api/admin/auth/profile
// @access  Private (JWT)
const getAdminProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found',
      });
    }

    res.status(200).json({
      success: true,
      user: admin,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Session expired or invalid token',
    });
  }
};

// @desc    Get All Administrators (from 'admins' table)
// @route   GET /api/admin/auth/list
// @access  Private (JWT)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins list',
    });
  }
};

// @desc    Admin Logout
// @route   POST /api/admin/auth/logout
// @access  Private
const logoutAdmin = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully',
  });
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  getAllAdmins,
  logoutAdmin,
  seedDefaultAdmin,
};
