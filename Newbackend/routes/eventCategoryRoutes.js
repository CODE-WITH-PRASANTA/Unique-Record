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

router
  .route('/')
  .get(getAllCategories)
  .post(createCategory);

router.patch('/:id/status', updateCategoryStatus);

router
  .route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
