const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile } = require('../controllers/adminAuthController');

router.post('/login', loginAdmin);
router.get('/me', getAdminProfile);
router.get('/profile', getAdminProfile);

module.exports = router;
