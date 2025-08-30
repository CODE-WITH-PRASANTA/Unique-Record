const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getPublishedBlogs,
} = require("../Controllers/blogController");

// CRUD routes
router.post("/create", upload.single("image"), createBlog);
router.get("/all", getAllBlogs);
router.get("/published", getPublishedBlogs); // GET only published blogs
router.get("/:id", getBlogById);
router.put("/update/:id", upload.single("image"), updateBlog);
router.delete("/delete/:id", deleteBlog);

// Publish / Unpublish routes
router.put("/publish/:id", publishBlog);
router.put("/unpublish/:id", unpublishBlog);

module.exports = router;
