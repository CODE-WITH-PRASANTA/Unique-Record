const BlogFeedback = require("../Model/BlogFeedback");

// @desc   Add new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, phone, subject, address, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, Email and Message are required." });
    }

    const feedback = new BlogFeedback({ name, email, phone, subject, address, message });
    await feedback.save();

    res.status(201).json({ 
      success: true, 
      message: "Feedback submitted successfully! Awaiting approval.", 
      data: feedback 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Get all published feedbacks (public view)
exports.getPublishedFeedbacks = async (req, res) => {
  try {
    const feedbacks = await BlogFeedback.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Get all feedbacks (admin view)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await BlogFeedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Toggle publish/unpublish feedback
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await BlogFeedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    feedback.isPublished = !feedback.isPublished;
    await feedback.save();

    res.json({ 
      success: true, 
      message: `Feedback ${feedback.isPublished ? "published" : "unpublished"} successfully`, 
      data: feedback 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Update feedback (admin only)
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await BlogFeedback.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedFeedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback updated successfully", data: updatedFeedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Delete feedback (admin only)
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await BlogFeedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
