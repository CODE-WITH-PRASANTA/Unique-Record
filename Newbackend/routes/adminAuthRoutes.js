const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  getAllAdmins,
  logoutAdmin,
} = require('../controllers/adminAuthController');

const { adminOnly } = require('../middleware/authMiddleware');

// Admin Portal Authentication (for NewAdminpannel in 'admins' table)
router.post('/login', loginAdmin);
router.get('/me', adminOnly, getAdminProfile);
router.get('/profile', adminOnly, getAdminProfile);
router.get('/list', adminOnly, getAllAdmins);
router.post('/logout', adminOnly, logoutAdmin);

module.exports = router;
