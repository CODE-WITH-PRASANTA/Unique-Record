const mongoose = require('mongoose');

const blogCommentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: 'Blog Feedback',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Please enter your feedback message'],
      trim: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: false,
    },
    blogTitle: {
      type: String,
      trim: true,
      default: '',
    },
    blogSlug: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Approved', 'Rejected'],
      default: 'Draft',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Keep isPublished in sync with status
blogCommentSchema.pre('save', function () {
  if (this.isModified('status')) {
    this.isPublished = this.status === 'Approved';
  } else if (this.isModified('isPublished')) {
    this.status = this.isPublished ? 'Approved' : 'Draft';
  }
});

module.exports = mongoose.model('BlogComment', blogCommentSchema);
