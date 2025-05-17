const express = require("express");
const router = express.Router();
const blogController = require("../Controllers/blogController");
const upload = require("../Middleware/multer");

// POST - Create Blog
router.post("/create", upload.single("image"), blogController.createBlog);

// PUT - Update Blog
router.put("/update/:id", upload.single("image"), blogController.updateBlog);

// DELETE - Delete Blog
router.delete("/delete/:id", blogController.deleteBlog);

// GET - Fetch All Blogs
router.get("/all", blogController.getAllBlogs);

// GET - Fetch Single Blog (Optional Bonus)
router.get("/:id", blogController.getSingleBlog);



module.exports = router;
