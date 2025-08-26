const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../Controllers/blogController");

router.post("/create", upload.single("image"), createBlog);
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/update/:id", upload.single("image"), updateBlog);
router.delete("/delete/:id", deleteBlog);



module.exports = router;
