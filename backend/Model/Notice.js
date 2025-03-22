const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  postingDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  postOwner: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  photo: {
    type: String
  },
  otherFiles: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
