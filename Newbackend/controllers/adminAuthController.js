const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'unique_record_admin_jwt_secret_key_2026';

// Helper to generate JWT Token
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      userId: admin.userId,
      email: admin.email,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Seed default admin if none exists
const seedDefaultAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({
      userId: 'admin',
      email: 'admin@uniquerecord.com',
      name: 'Super Administrator',
      password: 'admin', // Will be hashed automatically by pre-save hook
      role: 'admin',
    });
    console.log('✅ Default Admin seeded: userId=admin, password=admin');
  }
};

// @desc    Admin Login with JWT
// @route   POST /api/auth/login, POST /api/admin/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { userId, username, email, password } = req.body;

    const identifier = (userId || username || email || '').trim().toLowerCase();
    const enteredPassword = password || '';

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your User ID or Email',
      });
    }

    if (!enteredPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Password',
      });
    }

    await seedDefaultAdmin();

    // Find admin by userId or email
    let admin = await Admin.findOne({
      $or: [{ userId: identifier }, { email: identifier }],
    });

    if (!admin) {
      // Check if trying to login with default admin credentials
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
          message: 'Invalid User ID or Password',
        });
      }
    }

    // Verify Password
    const isMatch = await admin.matchPassword(enteredPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User ID or Password',
      });
    }

    // Generate JWT Token
    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back 🎉',
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
    console.error('Error logging in admin:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/auth/me
// @access  Private (JWT)
const getAdminProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
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

module.exports = {
  loginAdmin,
  getAdminProfile,
  seedDefaultAdmin,
};
