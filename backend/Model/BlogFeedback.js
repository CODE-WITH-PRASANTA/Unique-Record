const mongoose = require("mongoose");

const blogFeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    address: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    isPublished: { type: Boolean, default: false }, // requires admin approval
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogFeedback", blogFeedbackSchema);
