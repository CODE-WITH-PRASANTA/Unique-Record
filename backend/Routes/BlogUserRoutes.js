const express = require("express");
const router = express.Router();
const BlogUserController = require("../Controllers/BlogUserController");
const upload = require("../Middleware/multer"); // Using multer for file upload

// Route to create a new blog post
router.post("/create", upload.single("image"), BlogUserController.createBlogUserPost);

// Route to fetch all blog posts
router.get("/", BlogUserController.getAllBlogUserPosts);

// Route to update a blog post
router.put("/:id", upload.single("image"), BlogUserController.updateBlogUserPost);

// Route to approve a blog post
router.patch("/:id/approve", BlogUserController.approveBlogUserPost);

// Route to unapprove a blog post
router.patch("/:id/unapprove", BlogUserController.unapproveBlogUserPost);

module.exports = router;
