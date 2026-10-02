const express = require('express');
const router = express.Router();
const {
  submitBlogFeedback,
  getApprovedBlogFeedbacks,
  getAllBlogComments,
  getBlogCommentById,
  updateBlogCommentStatus,
  updateBlogComment,
  deleteBlogComment,
} = require('../controllers/blogCommentController');

// Submit Feedback routes (Public - saves initially as Draft)
router.post('/feedback', submitBlogFeedback);
router.post('/submit', submitBlogFeedback);
router.post('/', submitBlogFeedback);

// Public Feedbacks route (Returns approved comments for sidebar/display)
router.get('/feedbacks', getApprovedBlogFeedbacks);
router.get('/approved', getApprovedBlogFeedbacks);

// Admin Blog Comments route (Returns all Draft, Approved, Rejected)
router.get('/all-feedbacks', getAllBlogComments);
router.get('/all', getAllBlogComments);
router.get('/admin', getAllBlogComments);
router.get('/', getAllBlogComments);

// Single Resource routes by ID (supports multiple path structures)
router.get('/feedback/:id', getBlogCommentById);
router.put('/feedback/:id', updateBlogComment);
router.patch('/feedback/:id/toggle', updateBlogCommentStatus);
router.patch('/feedback/:id/status', updateBlogCommentStatus);
router.delete('/feedback/:id', deleteBlogComment);

router
  .route('/:id')
  .get(getBlogCommentById)
  .put(updateBlogComment)
  .patch(updateBlogCommentStatus)
  .delete(deleteBlogComment);

router.patch('/:id/status', updateBlogCommentStatus);

module.exports = router;
