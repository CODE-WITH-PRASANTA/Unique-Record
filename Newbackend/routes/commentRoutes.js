const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getApprovedFeedbacks,
  getAllAchievementComments,
  getCommentById,
  updateCommentStatus,
  deleteComment,
} = require('../controllers/achievementCommentController');

const {
  submitBlogFeedback,
  getApprovedBlogFeedbacks,
  getAllBlogComments,
} = require('../controllers/blogCommentController');

// Submit Feedback routes (Public)
router.post('/feedback', submitFeedback);
router.post('/achievement', submitFeedback);
router.post('/blog', submitBlogFeedback);
router.post('/blogs', submitBlogFeedback);
router.post('/', submitFeedback);

// Public Feedbacks route (Returns approved comments for frontend sidebar)
router.get('/feedbacks', getApprovedFeedbacks);
router.get('/approved', getApprovedFeedbacks);
router.get('/blogs/approved', getApprovedBlogFeedbacks);

// Admin Achievement / Blog Comments routes
router.get('/achievements', getAllAchievementComments);
router.get('/blogs', getAllBlogComments);
router.get('/all', getAllAchievementComments);
router.get('/', getAllAchievementComments);

// Single Resource routes by ID
router
  .route('/:id')
  .get(getCommentById)
  .delete(deleteComment);

router.patch('/:id/status', updateCommentStatus);

module.exports = router;
