const express = require('express');
const {
  createFeedback,
  getPublishedFeedbacks,
  getAllFeedbacks,
  togglePublishFeedback,
  updateFeedback,
  deleteFeedback,
} = require('../Controllers/achivmentCommentController');

const router = express.Router();

// Public route
router.post('/feedback', createFeedback);
router.get('/feedbacks', getPublishedFeedbacks);

// Admin routes
router.get('/all-feedbacks', getAllFeedbacks); // 👈 show all comments
router.put('/feedback/:id/publish', togglePublishFeedback);
router.put('/feedback/:id', updateFeedback);
router.delete('/feedback/:id', deleteFeedback);

module.exports = router;
