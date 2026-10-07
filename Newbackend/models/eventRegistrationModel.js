const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Transgender', 'Other'],
      required: [true, 'Gender/Sex is required'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required'],
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp mobile number is required'],
      trim: true,
    },
    pinCode: {
      type: String,
      required: [true, 'Pin code is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    educationalQualification: {
      type: String,
      required: [true, 'Educational qualification is required'],
      trim: true,
    },
    expertise: {
      type: String,
      default: '',
      trim: true,
    },
    bioData: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: '',
    },
    registrationFees: {
      type: String,
      default: '₹0',
    },
    paymentPlatform: {
      type: String,
      default: 'Razorpay',
    },
    paymentMethod: {
      type: String,
      default: 'Online / UPI / Card',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
      default: 'Pending',
    },
    paidAt: {
      type: Date,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
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
      enum: ['None', 'Initiated', 'Processed', 'Failed'],
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
    status: {
      type: String,
      enum: ['Pending', 'Under Process', 'Approved', 'Refund'],
      default: 'Pending',
    },
    adminRemark: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
eventRegistrationSchema.index({ eventName: 1 });
eventRegistrationSchema.index({ email: 1 });
eventRegistrationSchema.index({ status: 1 });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
