const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  providerName: {
    type: String,
    required: true,
  },
  achieverName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  effortType: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  uruHolderLink: {
    type: String,
    required: true,
  },
 tags: {
  type: [String],   // array of strings
  required: false,  // not required
  default: []       // fallback if not provided
},
  image: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
  },
  isPublished: {
    type: Boolean,
    default: false, // new field added
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
