const Newsletter = require("../Model/newsletterModel");

// @desc Subscribe to Newsletter
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already subscribed ✅" });
    }

    // Save new subscription
    const newSub = new Newsletter({ email });
    await newSub.save();

    res.status(201).json({ success: true, message: "Subscribed successfully 🎉" });
  } catch (err) {
    console.error("Newsletter Subscribe Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc Get All Subscribers (Admin only)
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: subscribers });
  } catch (err) {
    console.error("Fetch Subscribers Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc Delete a Subscriber (Admin only)
const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Newsletter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    res.status(200).json({ success: true, message: "Subscriber deleted successfully ❌" });
  } catch (err) {
    console.error("Delete Subscriber Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  subscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
};
