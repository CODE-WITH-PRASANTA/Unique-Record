// Model/AchivmentComment.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    address: { type: String },
    message: { type: String, required: true },
    isPublished: { type: Boolean, default: false }, // new field
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("AchivmentComment", feedbackSchema);
