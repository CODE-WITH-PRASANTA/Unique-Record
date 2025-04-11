const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  embedLink: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('YoutubeVideo', youtubeVideoSchema);
