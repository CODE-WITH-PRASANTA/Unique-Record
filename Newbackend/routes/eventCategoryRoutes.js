const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} = require('../controllers/eventCategoryController');

const { adminOnly } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllCategories)
  .post(adminOnly, createCategory);

router.patch('/:id/status', adminOnly, updateCategoryStatus);

router
  .route('/:id')
  .get(getCategoryById)
  .put(adminOnly, updateCategory)
  .delete(adminOnly, deleteCategory);

module.exports = router;
