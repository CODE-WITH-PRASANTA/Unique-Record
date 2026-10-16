const express = require('express');
const router = express.Router();
const {
  getPublishedAchievements,
  getAllAchievements,
  getAchievementById,
  postAchievement,
  updateAchievement,
  togglePublish,
  deleteAchievement,
} = require('../controllers/achievementController');
const {
  uploadAchievement,
  processAchievementImage,
} = require('../middleware/achievementUploadMiddleware');
const { adminOnly, optionalAuth } = require('../middleware/authMiddleware');

// Dedicated upload route (Admin Only)
router.post(
  '/upload',
  adminOnly,
  uploadAchievement.single('image'),
  processAchievementImage,
  (req, res) => {
    if (!req.uploadedWebp) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    res.status(200).json({
      success: true,
      url: req.uploadedWebp,
      image: req.uploadedWebp,
    });
  }
);

// Published list routes (Frontend default)
router.get('/get-published-achievements', getPublishedAchievements);
router.get('/published', getPublishedAchievements);

// All achievements routes (Admin / Optional Auth)
router.get('/all', optionalAuth, getAllAchievements);
router.get('/get-all-achievements', optionalAuth, getAllAchievements);

// Single achievement by ID route (Legacy named path)
router.get('/get-achievement/:id', getAchievementById);

// Create / Post achievement routes (Admin Only)
router.post(
  '/post',
  adminOnly,
  uploadAchievement.single('image'),
  processAchievementImage,
  postAchievement
);
router.post(
  '/create',
  adminOnly,
  uploadAchievement.single('image'),
  processAchievementImage,
  postAchievement
);

// Base root routes
router
  .route('/')
  .get(getPublishedAchievements)
  .post(
    adminOnly,
    uploadAchievement.single('image'),
    processAchievementImage,
    postAchievement
  );

// Single resource routes by ID
router
  .route('/:id')
  .get(getAchievementById)
  .put(
    adminOnly,
    uploadAchievement.single('image'),
    processAchievementImage,
    updateAchievement
  )
  .delete(adminOnly, deleteAchievement);

router.put(
  '/update/:id',
  adminOnly,
  uploadAchievement.single('image'),
  processAchievementImage,
  updateAchievement
);

router.delete('/delete/:id', adminOnly, deleteAchievement);

// Publish / Status toggle routes (Admin Only)
router.patch('/:id/publish', adminOnly, togglePublish);
router.patch('/:id/status', adminOnly, togglePublish);
router.patch('/publish/:id', adminOnly, togglePublish);

module.exports = router;
