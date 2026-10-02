const mongoose = require('mongoose');

const userOpinionSchema = new mongoose.Schema(
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
    age: {
      type: String,
      trim: true,
      default: '',
    },
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: 'Contact Inquiry / User Opinion',
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Approved', 'Rejected'],
      default: 'Draft', // Saved initially as Draft for Admin Review
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
userOpinionSchema.pre('save', function () {
  if (this.isModified('status')) {
    this.isPublished = this.status === 'Approved';
  } else if (this.isModified('isPublished')) {
    this.status = this.isPublished ? 'Approved' : 'Draft';
  }
});

module.exports = mongoose.model('UserOpinion', userOpinionSchema);
