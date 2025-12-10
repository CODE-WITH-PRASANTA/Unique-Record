// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  togglePublishCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// @route GET /api/categories
// @desc  Get all categories
router.get("/", getCategories);

// @route POST /api/categories
// @desc  Create a new category
router.post("/", createCategory);

// @route PUT /api/categories/:id
// @desc  Update category name
router.put("/:id", updateCategory);

// @route PATCH /api/categories/:id/publish
// @desc  Toggle or set category publish state
router.patch("/:id/publish", togglePublishCategory);

// @route DELETE /api/categories/:id
// @desc  Delete a category
router.delete("/:id", deleteCategory);

module.exports = router;
