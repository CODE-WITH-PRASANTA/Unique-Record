const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userAuthController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Signup / Registration (Supports /signup and /register)
router.post('/register', registerUser);
router.post('/signup', registerUser);

// Login
router.post('/login', loginUser);

// Forgot Password / OTP Flow (Supports all route aliases)
router.post('/forgot-password', forgotPasswordUser);
router.post('/send-otp', forgotPasswordUser);
router.post('/verify-otp', verifyOtpUser);
router.post('/validate-otp', verifyOtpUser);
router.post('/reset-password', resetPasswordUser);
router.post('/change-password', resetPasswordUser);

// Profile (Authenticated User)
router.get('/me', protect, getUserProfile);
router.get('/profile', protect, getUserProfile);
router.get('/user', protect, getUserProfile);

// Table Operations on 'users' collection (Admin Only)
router.get('/all', adminOnly, getAllFrontendUsers);
router.get('/list', adminOnly, getAllFrontendUsers);
router.get('/', adminOnly, getAllFrontendUsers);
router.get('/:id', adminOnly, getFrontendUserById);
router.delete('/:id', adminOnly, deleteFrontendUser);
router.patch('/:id/status', adminOnly, updateFrontendUserStatus);

module.exports = router;
