const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  getAllAdmins,
  logoutAdmin,
} = require('../controllers/adminAuthController');

// Admin Portal Authentication (for NewAdminpannel in 'admins' table)
router.post('/login', loginAdmin);
router.get('/me', getAdminProfile);
router.get('/profile', getAdminProfile);
router.get('/list', getAllAdmins);
router.post('/logout', logoutAdmin);

module.exports = router;
