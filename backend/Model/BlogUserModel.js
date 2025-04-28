const mongoose = require("mongoose");

const BlogUserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    default: "Anonymous",
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  image: {
    type: String, // URL of the image uploaded to Cloudinary
  },
  isApproved: { // New field to track approval
    type: Boolean,
    default: false, // Initially, blogs are not approved
  },
}, { timestamps: true });

const BlogUserModel = mongoose.model("BlogUser", BlogUserSchema);

module.exports = BlogUserModel;
