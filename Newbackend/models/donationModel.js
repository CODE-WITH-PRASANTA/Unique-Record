const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Donation amount must be at least ₹1'],
    },
    name: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    certificate: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No',
    },
    panNumber: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    extra: {
      type: String,
      trim: true,
      default: '',
    },
    paymentPlatform: {
      type: String,
      default: 'Razorpay',
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay Online Checkout',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
      default: 'Paid',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Completed', 'Refund', 'Pending'],
      default: 'Completed',
    },
    refundId: {
      type: String,
      default: '',
    },
    refundAmount: {
      type: String,
      default: '',
    },
    refundStatus: {
      type: String,
      enum: ['None', 'Processed', 'Failed'],
      default: 'None',
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundReason: {
      type: String,
      default: '',
    },
    adminRemark: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Donation', donationSchema);
