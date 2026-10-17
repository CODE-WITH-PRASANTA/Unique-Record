const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  toggleBlogStatus,
  deleteBlog,
} = require('../controllers/blogController');
const { upload, convertToWebp } = require('../middleware/uploadMiddleware');
const { adminOnly } = require('../middleware/authMiddleware');

// Dedicated image upload route (returns WebP url, Admin Only)
router.post('/upload', adminOnly, upload.single('image'), convertToWebp, (req, res) => {
  if (!req.uploadedWebp) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }
  res.status(200).json({
    success: true,
    url: req.uploadedWebp,
    message: 'Image converted to WebP successfully and saved to upload/blog',
  });
});

router.route('/')
  .get(getBlogs)
  .post(upload.single('image'), convertToWebp, createBlog);

router.post('/create', adminOnly, upload.single('image'), convertToWebp, createBlog);

router.get('/all', getAllBlogsAdmin);
router.get('/published', getBlogs);

router.route('/:id')
  .get(getBlogById)
  .put(adminOnly, upload.single('image'), convertToWebp, updateBlog)
  .delete(adminOnly, deleteBlog);

router.route('/:id/status')
  .patch(adminOnly, toggleBlogStatus);

module.exports = router;
