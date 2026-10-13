const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const { adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(adminOnly, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(adminOnly, updateCategory)
  .delete(adminOnly, deleteCategory);

module.exports = router;
