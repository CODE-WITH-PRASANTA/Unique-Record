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

router
  .route('/')
  .get(getAchievementCategories)
  .post(createAchievementCategory);

router
  .route('/:id')
  .get(getAchievementCategoryById)
  .put(updateAchievementCategory)
  .delete(deleteAchievementCategory);

router.patch('/:id/status', toggleCategoryStatus);

module.exports = router;
