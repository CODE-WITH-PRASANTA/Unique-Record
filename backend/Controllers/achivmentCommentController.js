const Feedback = require('../Model/AchivmentComment');

// @desc Create a new feedback
const createFeedback = async (req, res) => {
  const { name, email, phone, subject, address, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  try {
    const feedback = new Feedback({
      name,
      email,
      phone,
      subject,
      address,
      message,
    });

    const saved = await feedback.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Get only published feedbacks (public)
const getPublishedFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Get all feedbacks (admin)
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Admin toggle publish/unpublish feedback
const togglePublishFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    feedback.isPublished = !feedback.isPublished;
    const updated = await feedback.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Update feedback (admin edit)
const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, subject, address, message } = req.body;

  try {
    const updated = await Feedback.findByIdAndUpdate(
      id,
      { name, email, phone, subject, address, message },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Feedback not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Delete feedback
const deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Feedback not found' });

    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createFeedback,
  getPublishedFeedbacks,
  getAllFeedbacks,
  togglePublishFeedback,
  updateFeedback,
  deleteFeedback,
};
