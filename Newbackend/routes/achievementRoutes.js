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

// Dedicated upload route
router.post(
  '/upload',
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

// All achievements routes (Admin)
router.get('/all', getAllAchievements);
router.get('/get-all-achievements', getAllAchievements);

// Single achievement by ID route (Legacy named path)
router.get('/get-achievement/:id', getAchievementById);

// Create / Post achievement routes
router.post(
  '/post',
  uploadAchievement.single('image'),
  processAchievementImage,
  postAchievement
);
router.post(
  '/create',
  uploadAchievement.single('image'),
  processAchievementImage,
  postAchievement
);

// Base root routes
router
  .route('/')
  .get(getPublishedAchievements)
  .post(
    uploadAchievement.single('image'),
    processAchievementImage,
    postAchievement
  );

// Single resource routes by ID
router
  .route('/:id')
  .get(getAchievementById)
  .put(
    uploadAchievement.single('image'),
    processAchievementImage,
    updateAchievement
  )
  .delete(deleteAchievement);

router.put(
  '/update/:id',
  uploadAchievement.single('image'),
  processAchievementImage,
  updateAchievement
);

router.delete('/delete/:id', deleteAchievement);

// Publish / Status toggle routes
router.patch('/:id/publish', togglePublish);
router.patch('/:id/status', togglePublish);
router.patch('/publish/:id', togglePublish);

module.exports = router;
