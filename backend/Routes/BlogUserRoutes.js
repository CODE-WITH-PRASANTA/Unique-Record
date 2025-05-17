const express = require("express");
const router = express.Router();
const BlogUserController = require("../Controllers/BlogUserController");
const upload = require("../Middleware/multer");

// Create a new blog post
router.post("/create", upload.single("image"), BlogUserController.createBlogUserPost);

// Get only approved blog posts
router.get("/approved", BlogUserController.getApprovedBlogUserPosts);

router.get("/approved/:id", BlogUserController.getSingleApprovedBlogUserPost);

// Get only unapproved blog posts
router.get("/unapproved", BlogUserController.getUnapprovedBlogUserPosts);

// Update a blog post
router.put("/:id", upload.single("image"), BlogUserController.updateBlogUserPost);

// Approve a blog post
router.patch("/:id/approve", BlogUserController.approveBlogUserPost);

// Unapprove (delete) a blog post
router.delete("/:id/unapprove", BlogUserController.unapproveBlogUserPost);


// Route to fetch all blog posts
router.get("/", BlogUserController.getAllBlogUserPosts);


module.exports = router;
