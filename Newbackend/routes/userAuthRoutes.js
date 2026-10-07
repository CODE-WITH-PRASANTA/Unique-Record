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

// Profile
router.get('/me', getUserProfile);
router.get('/profile', getUserProfile);
router.get('/user', getUserProfile);

// Table Operations on 'users' collection
router.get('/all', getAllFrontendUsers);
router.get('/list', getAllFrontendUsers);
router.get('/', getAllFrontendUsers);
router.get('/:id', getFrontendUserById);
router.delete('/:id', deleteFrontendUser);
router.patch('/:id/status', updateFrontendUserStatus);

module.exports = router;
