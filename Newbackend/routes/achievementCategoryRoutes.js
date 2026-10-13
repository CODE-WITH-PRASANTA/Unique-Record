const express = require('express');
const router = express.Router();
const {
  getAchievementCategories,
  getAchievementCategoryById,
  createAchievementCategory,
  updateAchievementCategory,
  deleteAchievementCategory,
  toggleCategoryStatus,
} = require('../controllers/achievementCategoryController');

const { adminOnly } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAchievementCategories)
  .post(adminOnly, createAchievementCategory);

router
  .route('/:id')
  .get(getAchievementCategoryById)
  .put(adminOnly, updateAchievementCategory)
  .delete(adminOnly, deleteAchievementCategory);

router.patch('/:id/status', adminOnly, toggleCategoryStatus);

module.exports = router;
