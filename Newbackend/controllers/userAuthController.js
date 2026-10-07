const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const GeneratingOtp = require('../models/generatingOtpModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendResetPasswordOtp } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'unique_record_jwt_secret_key_2026_super_secure';

// Helper to generate JWT Token
const generateUserToken = (user, role = 'user') => {
  return jwt.sign(
    {
      id: user._id,
      fullName: user.fullName || user.name,
      name: user.name || user.fullName,
      email: user.email,
      uniqueId: user.uniqueId || user.userId,
      userId: user.userId || user.uniqueId,
      role: user.role || role,
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
        password: 'admin',
        role: 'admin',
      });
      console.log('✅ Default Admin seeded in admins collection');
    }
  } catch (err) {
    console.error('Error seeding default admin:', err.message);
  }
};

// @desc    Register / Sign Up (Handles both Frontend and Admin Panel Signups)
// @route   POST /api/auth/signup, POST /api/auth/register, POST /api/user/register, POST /api/user/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    let {
      fullName,
      name,
      phoneNumber,
      phone,
      email,
      password,
      confirmPassword,
      userId,
      username,
      role,
    } = req.body;

    const finalName = (fullName || name || userId || username || 'User').trim();
    const finalPhone = (phoneNumber || phone || '').trim();
    const userEmail = (email || '').trim().toLowerCase();

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters long',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user already exists in 'users' collection
    const queryConditions = [{ email: userEmail }];
    if (finalPhone) queryConditions.push({ phoneNumber: finalPhone });

    const existingUser = await User.findOne({ $or: queryConditions });

    if (existingUser) {
      if (existingUser.email === userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered. Please log in instead.',
        });
      }
      if (finalPhone && existingUser.phoneNumber === finalPhone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists',
        });
      }
    }

    // Generate unique ID like: 26OS123456
    const uniqueId = `${new Date().getFullYear().toString().slice(2)}OS${crypto.randomInt(100000, 999999)}`;

    // Create and save to 'users' collection
    const newUser = await User.create({
      fullName: finalName,
      phoneNumber: finalPhone || '—',
      email: userEmail,
      password: password, // Pre-save hook hashes this
      uniqueId: uniqueId,
      status: 'Active',
    });

    // If registered as admin role, also ensure in admins collection
    if (role === 'admin' || (userId && !fullName)) {
      const existingAdmin = await Admin.findOne({ email: userEmail });
      if (!existingAdmin) {
        await Admin.create({
          userId: (userId || username || uniqueId).toLowerCase(),
          email: userEmail,
          name: finalName,
          password: password,
          role: 'admin',
        });
      }
    }

    const token = generateUserToken(newUser, role || 'user');

    // Send confirmation welcome email if email credentials configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Unique Records of Universe" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '✅ Registration Successful – Unique Records of Universe',
        html: `
          <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
            <table align="center" width="600" cellpadding="0" cellspacing="0" 
              style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
              <tr style="background:linear-gradient(90deg,#2c3e50,#34495e); color:white;">
                <td style="padding:20px; text-align:center;">
                  <h1 style="margin:0; font-size:22px;">Unique Records of Universe</h1>
                  <p style="margin:0; font-size:14px;">Recognizing Achievements Worldwide</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333;">
                  <h2 style="color:#2c3e50;">Hello ${finalName},</h2>
                  <p style="font-size:15px; line-height:1.6;">
                    🎉 Welcome to <b>Unique Records of Universe</b>! Your account has been created successfully.
                  </p>
                  <div style="background:#f9f9f9; border-left:4px solid #e67e22; padding:15px; margin:20px 0; border-radius:4px;">
                    <p style="margin:0; font-size:15px;">
                      <b>📌 Your Unique ID:</b> 
                      <span style="color:#e67e22; font-weight:bold;">${uniqueId}</span>
                    </p>
                  </div>
                  <p style="font-size:15px; line-height:1.6;">
                    Please keep this Unique ID safe for logins and record verification.
                  </p>
                </td>
              </tr>
              <tr style="background:#ecf0f1;">
                <td style="padding:15px; text-align:center; font-size:12px; color:#7f8c8d;">
                  <p style="margin:5px 0;">© ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</p>
                </td>
              </tr>
            </table>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error('Registration Email Error:', err.message);
        else console.log('✅ Registration email sent successfully');
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account registered successfully 🎉',
      uniqueId: uniqueId,
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        name: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        uniqueId: newUser.uniqueId,
        userId: newUser.uniqueId,
        role: role || 'user',
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    User / Admin Login with JWT
// @route   POST /api/auth/login, POST /api/user/login, POST /api/admin/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, email, phoneNumber, userId, username, password } = req.body;
    const identifier = (emailOrPhone || email || phoneNumber || userId || username || '').trim().toLowerCase();
    const enteredPassword = password || '';

    if (!identifier || !enteredPassword) {
      return res.status(400).json({
        success: false,
        message: 'User ID / Email and password are required',
      });
    }

    await seedDefaultAdmin();

    // 1. Check in 'users' collection first
    let user = await User.findOne({
      $or: [
        { email: identifier },
        { phoneNumber: identifier },
        { uniqueId: identifier },
        { uniqueId: identifier.toUpperCase() },
      ],
    });

    let role = 'user';
    let isMatch = false;

    if (user) {
      isMatch = await user.matchPassword(enteredPassword);
    }

    // 2. If not found or password didn't match, check in 'admins' collection
    if (!user || !isMatch) {
      const admin = await Admin.findOne({
        $or: [{ userId: identifier }, { email: identifier }],
      });

      if (admin) {
        const adminMatch = await admin.matchPassword(enteredPassword);
        if (adminMatch) {
          const token = generateUserToken(admin, 'admin');
          return res.status(200).json({
            success: true,
            message: 'Admin login successful! Welcome back 🎉',
            token,
            user: {
              id: admin._id,
              fullName: admin.name || 'Super Administrator',
              name: admin.name || 'Super Administrator',
              email: admin.email,
              uniqueId: admin.userId,
              userId: admin.userId,
              role: admin.role || 'admin',
              lastLogin: new Date().toLocaleString(),
            },
          });
        }
      }

      // Default fallback for initial admin
      if (identifier === 'admin' && enteredPassword === 'admin') {
        let defaultAdmin = await Admin.findOne({ userId: 'admin' });
        if (!defaultAdmin) {
          defaultAdmin = await Admin.create({
            userId: 'admin',
            email: 'admin@uniquerecord.com',
            name: 'Super Administrator',
            password: 'admin',
            role: 'admin',
          });
        }
        const token = generateUserToken(defaultAdmin, 'admin');
        return res.status(200).json({
          success: true,
          message: 'Admin login successful! Welcome back 🎉',
          token,
          user: {
            id: defaultAdmin._id,
            fullName: defaultAdmin.name,
            name: defaultAdmin.name,
            email: defaultAdmin.email,
            uniqueId: defaultAdmin.userId,
            userId: defaultAdmin.userId,
            role: 'admin',
            lastLogin: new Date().toLocaleString(),
          },
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid User ID / Email or Password',
      });
    }

    // Generate JWT Token for user
    const token = generateUserToken(user, 'user');

    // Update tokens and lastLogin
    if (!user.tokens) user.tokens = [];
    user.tokens.push(token);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back 🎉',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        name: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        uniqueId: user.uniqueId,
        userId: user.uniqueId,
        role: 'user',
        status: user.status || 'Active',
        lastLogin: user.lastLogin ? user.lastLogin.toLocaleString() : new Date().toLocaleString(),
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Forgot Password - Send Gmail OTP
// @route   POST /api/auth/forgot-password, POST /api/user/forgot-password, POST /api/forgot-password/forgot-password
// @access  Public
const forgotPasswordUser = async (req, res) => {
  try {
    const { email, emailOrPhone, identifier } = req.body;
    const target = (email || emailOrPhone || identifier || '').trim().toLowerCase();

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address.',
      });
    }

    // Find in 'users' collection first (case-insensitive regex), then in 'admins'
    const safeRegex = new RegExp(`^${target.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i');
    let account = await User.findOne({
      $or: [{ email: safeRegex }, { phoneNumber: target }, { uniqueId: target }, { uniqueId: target.toUpperCase() }],
    });

    if (!account) {
      account = await Admin.findOne({
        $or: [{ email: safeRegex }, { userId: target.toLowerCase() }],
      });
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: `No account found associated with '${target}'. Please check the email or sign up first.`,
      });
    }

    const targetAccountEmail = account.email.toLowerCase();

    // Generate 6-digit OTP & 10 min expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    // Save in user/admin document
    account.resetPasswordOtp = otp;
    account.resetPasswordOtpExpire = otpExpire;
    await account.save({ validateBeforeSave: false });

    // Save in GeneratingOtp collection with TTL auto-expiry
    try {
      await GeneratingOtp.deleteMany({ email: targetAccountEmail });
      await GeneratingOtp.create({
        email: targetAccountEmail,
        otp: otp,
        expiresAt: otpExpire,
      });
    } catch (dbOtpErr) {
      console.warn('⚠️ GeneratingOtp collection save error:', dbOtpErr.message);
    }

    console.log(`\n========================================`);
    console.log(`🔐 [PASSWORD RESET OTP]`);
    console.log(`Account: ${account.fullName || account.name || account.email} (${targetAccountEmail})`);
    console.log(`Code:    ${otp}`);
    console.log(`Valid:   10 minutes`);
    console.log(`========================================\n`);

    // Send email using Nodemailer
    const emailResult = await sendResetPasswordOtp(
      targetAccountEmail,
      otp,
      account.fullName || account.name || 'Valued User'
    );

    // Mask email for privacy
    const [localPart, domain] = targetAccountEmail.split('@');
    const maskedEmail =
      localPart.length > 2
        ? `${localPart[0]}***${localPart.slice(-1)}@${domain}`
        : `${localPart}@${domain}`;

    if (emailResult.sent) {
      return res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${maskedEmail}! Please check your inbox and spam folder.`,
        email: targetAccountEmail,
      });
    } else {
      console.warn(`⚠️ SMTP delivery failed: ${emailResult.error}`);
      return res.status(500).json({
        success: false,
        message: `Failed to send email to ${maskedEmail}. Please try again later.`,
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing password reset request',
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp, POST /api/user/verify-otp, POST /api/forgot-password/verify-otp
// @access  Public
const verifyOtpUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userEmail = (email || '').trim().toLowerCase();
    const code = (otp || '').toString().trim();

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the 6-digit OTP code',
      });
    }

    // 1. Check in GeneratingOtp collection
    let isOtpValid = false;
    const otpDoc = await GeneratingOtp.findOne({ email: userEmail, otp: code });
    if (otpDoc) {
      if (otpDoc.expiresAt && otpDoc.expiresAt >= new Date()) {
        isOtpValid = true;
      }
    }

    // 2. Check in User / Admin document
    if (!isOtpValid) {
      let account = await User.findOne({ email: userEmail });
      if (!account) {
        account = await Admin.findOne({ email: userEmail });
      }

      if (account && account.resetPasswordOtp === code) {
        if (account.resetPasswordOtpExpire && account.resetPasswordOtpExpire >= new Date()) {
          isOtpValid = true;
        } else {
          return res.status(400).json({
            success: false,
            message: 'OTP has expired. Please request a new code.',
          });
        }
      }
    }

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please check and try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully! You can now set your new password.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
    });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password, POST /api/user/reset-password, POST /api/forgot-password/reset-password
// @access  Public
const resetPasswordUser = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword, password } = req.body;
    const userEmail = (email || '').trim().toLowerCase();
    const targetPassword = newPassword || password || '';

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!targetPassword || targetPassword.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 4 characters long',
      });
    }

    if (confirmPassword && targetPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation does not match',
      });
    }

    let account = await User.findOne({ email: userEmail });
    if (!account) {
      account = await Admin.findOne({ email: userEmail });
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    // Update password (pre-save hook hashes it)
    account.password = targetPassword;
    account.resetPasswordOtp = null;
    account.resetPasswordOtpExpire = null;
    await account.save();

    // Clean up GeneratingOtp records
    await GeneratingOtp.deleteMany({ email: userEmail });

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in 🎉',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
    });
  }
};

// @desc    Get Current User / Admin Profile
// @route   GET /api/auth/me, GET /api/user/me
// @access  Private (JWT)
const getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let account = await User.findById(decoded.id).select('-password -resetPasswordOtp -resetPasswordOtpExpire');
    if (!account) {
      account = await Admin.findById(decoded.id).select('-password');
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    res.status(200).json({
      success: true,
      user: account,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Session expired or invalid token',
    });
  }
};

// @desc    Get All Frontend Users from 'users' table
// @route   GET /api/user/all, GET /api/users, GET /api/users/all
// @access  Public / Private
const getAllFrontendUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordOtp -resetPasswordOtpExpire')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching frontend users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users from database',
    });
  }
};

// @desc    Get Single Frontend User by ID
// @route   GET /api/user/:id, GET /api/users/:id
// @access  Public / Private
const getFrontendUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordOtp -resetPasswordOtpExpire');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
    });
  }
};

// @desc    Delete Frontend User from 'users' table
// @route   DELETE /api/user/:id, DELETE /api/users/:id
// @access  Public / Private
const deleteFrontendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `User ${user.fullName} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

// @desc    Update Frontend User Status
// @route   PATCH /api/user/:id/status, PATCH /api/users/:id/status
// @access  Public / Private
const updateFrontendUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: status || 'Active' },
      { new: true }
    ).select('-password -resetPasswordOtp -resetPasswordOtpExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPasswordUser,
  verifyOtpUser,
  resetPasswordUser,
  getUserProfile,
  getAllFrontendUsers,
  getFrontendUserById,
  deleteFrontendUser,
  updateFrontendUserStatus,
};
