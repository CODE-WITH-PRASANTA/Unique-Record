const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true, // Needed for deletion from Cloudinary
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Photo", photoSchema);
