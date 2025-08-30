const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: { type: String, required: true },
    shortDescription: { type: String, required: true },
    quotes: { type: String },
    blogContent: { type: String, required: true },
    category: { type: String, required: true },
    authorName: { type: String, required: true },
    authorDesignation: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    address: { type: String },
    tags: [{ type: String }],
    imageUrl: { type: String, required: true },
    isPublished: {
      type: Boolean,
      default: false, // new field added
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
