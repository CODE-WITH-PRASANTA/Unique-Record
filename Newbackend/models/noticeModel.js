const mongoose = require('mongoose');

const FileAttachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const NoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    postingDate: {
      type: String,
      required: [true, 'Posting date is required'],
      trim: true,
    },
    postOwner: {
      type: String,
      required: [true, 'Post owner is required'],
      trim: true,
      default: 'Admin',
    },
    description: {
      type: String,
      required: [true, 'Notice description is required'],
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    photo: {
      type: String,
      default: '',
    },
    files: {
      type: [FileAttachmentSchema],
      default: [],
    },
    otherFiles: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notice', NoticeSchema);
