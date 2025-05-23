const express = require('express');
const router = express.Router();
const achievementController = require('../Controllers/achievementController');
const upload = require("../Middleware/multer");

router.post('/post-achievement', upload.single('image'), achievementController.postAchievement);
router.get('/get-all-achievements', achievementController.getAllAchievements);
router.get('/get-achievement/:id', achievementController.getAchievementById);
router.put('/update-achievement-photo/:id', upload.single('image'), achievementController.updateAchievementPhoto);
router.delete('/delete-achievement/:id', achievementController.deleteAchievement);

module.exports = router;