const mongoose = require('mongoose');

const generatingOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // MongoDB TTL index: auto-delete after 10 minutes
  },
});

module.exports = mongoose.model('GeneratingOtp', generatingOtpSchema);
