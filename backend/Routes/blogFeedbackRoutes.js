const express = require("express");
const {
  createFeedback,
  getPublishedFeedbacks,
  getAllFeedbacks,
  togglePublish,
  updateFeedback,
  deleteFeedback,
} = require("../Controllers/blogFeedbackController");

const router = express.Router();

// Public routes
router.post("/feedback", createFeedback);         // Submit feedback
router.get("/feedbacks", getPublishedFeedbacks);  // Get published feedbacks

// Admin routes
router.get("/all-feedbacks", getAllFeedbacks);    // Get all feedbacks
router.patch("/feedback/:id/toggle", togglePublish); // Toggle publish/unpublish
router.put("/feedback/:id", updateFeedback);      // Update feedback
router.delete("/feedback/:id", deleteFeedback);   // Delete feedback

module.exports = router;
