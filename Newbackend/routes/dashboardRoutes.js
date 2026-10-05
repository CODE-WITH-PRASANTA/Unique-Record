const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);
router.get('/analytics', getDashboardStats);

module.exports = router;
