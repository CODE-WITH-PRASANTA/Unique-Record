const Newsletter = require('../models/newsletterModel');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe, POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        data: existing,
      });
    }

    const subscriber = await Newsletter.create({
      email: trimmedEmail,
    });

    res.status(201).json({
      success: true,
      message: 'Subscribed to newsletter successfully! 🎉',
      data: subscriber,
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error subscribing to newsletter',
    });
  }
};

// @desc    Get all subscribers for Admin Panel
// @route   GET /api/newsletter, GET /api/newsletter/all
// @access  Admin / Public
const getAllSubscribers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const subscribers = await Newsletter.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching subscribers',
    });
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/newsletter/:id
// @access  Admin
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting subscriber',
    });
  }
};

module.exports = {
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber,
};
