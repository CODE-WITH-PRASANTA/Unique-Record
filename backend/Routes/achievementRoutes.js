const express = require('express');
const router = express.Router();
const achievementController = require('../Controllers/achievementController');
const upload = require("../Middleware/multer");

// Create Achievement
router.post('/post-achievement', upload.single('image'), achievementController.postAchievement);

// Get All Achievements
router.get('/get-all-achievements', achievementController.getAllAchievements);

// Get Achievement by ID
router.get('/get-achievement/:id', achievementController.getAchievementById);

// Update Achievement Photo
router.put('/update-achievement-photo/:id', upload.single('image'), achievementController.updateAchievementPhoto);

// Delete Achievement
router.delete('/delete-achievement/:id', achievementController.deleteAchievement);

// Publish Achievement
router.put('/publish-achievement/:id', achievementController.publishAchievement);

// Unpublish Achievement
router.put('/unpublish-achievement/:id', achievementController.unpublishAchievement);

// Get All Published Achievements
router.get('/get-published-achievements', achievementController.getPublishedAchievements);

module.exports = router;
