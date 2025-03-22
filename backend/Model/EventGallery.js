const mongoose = require("mongoose");

const EventGallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  instagram: { type: String, default: "" },
  facebook: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EventGallery", EventGallerySchema);
