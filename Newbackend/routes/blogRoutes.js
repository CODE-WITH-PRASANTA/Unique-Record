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

// Dedicated image upload route (returns WebP url)
router.post('/upload', upload.single('image'), convertToWebp, (req, res) => {
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

router.post('/create', upload.single('image'), convertToWebp, createBlog);

router.get('/all', getAllBlogsAdmin);
router.get('/published', getBlogs);

router.route('/:id')
  .get(getBlogById)
  .put(upload.single('image'), convertToWebp, updateBlog)
  .delete(deleteBlog);

router.route('/:id/status')
  .patch(toggleBlogStatus);

module.exports = router;
