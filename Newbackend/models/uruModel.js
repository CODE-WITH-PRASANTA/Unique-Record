const mongoose = require('mongoose');

const uruSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      default: 'Unique Record',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    uniqueId: {
      type: String,
    },
    applicationNumber: {
      type: String,
      unique: true,
      index: true,
    },
    appNo: {
      type: String,
    },
    regNo: {
      type: String,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    sex: {
      type: String,
      default: 'Other',
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    educationalQualification: {
      type: String,
      trim: true,
    },
    whatsappMobileNumber: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'Other',
    },
    formCategory: {
      type: String,
      default: 'Other',
    },
    recordCategory: {
      type: String,
      default: 'Other',
    },
    effortType: {
      type: String,
      default: 'Individual Effort',
    },
    activityTitle: {
      type: String,
      trim: true,
    },
    recordTitle: {
      type: String,
      trim: true,
    },
    activityDescription: {
      type: String,
      trim: true,
    },
    recordDescription: {
      type: String,
      trim: true,
    },
    activityPurpose: {
      type: String,
      trim: true,
    },
    purposeOfRecordAttempt: {
      type: String,
      trim: true,
    },
    attemptDate: {
      type: Date,
    },
    dateOfAttempt: {
      type: Date,
    },
    activityVenue: {
      type: String,
      trim: true,
    },
    recordVenue: {
      type: String,
      trim: true,
    },
    organisationName: {
      type: String,
      trim: true,
    },

    // Media & Social Links
    googleDriveLink: [{ type: String }],
    facebookLink: [{ type: String }],
    youtubeLink: [{ type: String }],
    instagramLink: [{ type: String }],
    linkedInLink: [{ type: String }],
    twitterLink: [{ type: String }],
    xLink: [{ type: String }],
    pinterestLink: [{ type: String }],
    otherMediaLink: [{ type: String }],

    // Uploaded Files
    photos: [
      {
        url: { type: String },
        public_id: { type: String },
        filename: { type: String },
      },
    ],
    videos: [
      {
        url: { type: String },
        public_id: { type: String },
        filename: { type: String },
      },
    ],
    documents: [
      {
        url: { type: String },
        public_id: { type: String },
        filename: { type: String },
      },
    ],

    // Witnesses
    witness1: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      address: { type: String, default: '' },
      mobileNumber: { type: String, default: '' },
      emailId: { type: String, default: '' },
    },
    witness2: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      address: { type: String, default: '' },
      mobileNumber: { type: String, default: '' },
      emailId: { type: String, default: '' },
    },

    // Status & Approval
    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Paid'],
      default: 'Pending',
    },
    price: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Success'],
      default: 'Pending',
    },
    priceUpdated: {
      type: Boolean,
      default: false,
    },
    priceUpdatedDate: {
      type: Date,
    },
    approvedDate: {
      type: Date,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    certificateUrl: {
      type: String,
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

// Auto-sync alias fields before saving
uruSchema.pre('save', function () {
  if (!this.appNo && this.applicationNumber) {
    this.appNo = this.applicationNumber;
  }
  if (!this.applicationNumber && this.appNo) {
    this.applicationNumber = this.appNo;
  }
  if (!this.name && this.applicantName) {
    this.name = this.applicantName;
  }
  if (!this.applicantName && this.name) {
    this.applicantName = this.name;
  }
  if (!this.mobile && this.whatsappMobileNumber) {
    this.mobile = this.whatsappMobileNumber;
  }
  if (!this.whatsappMobileNumber && this.mobile) {
    this.whatsappMobileNumber = this.mobile;
  }
  if (!this.email && this.emailId) {
    this.email = this.emailId;
  }
  if (!this.emailId && this.email) {
    this.emailId = this.email;
  }
  if (!this.recordTitle && this.activityTitle) {
    this.recordTitle = this.activityTitle;
  }
  if (!this.recordDescription && this.activityDescription) {
    this.recordDescription = this.activityDescription;
  }
  if (!this.purposeOfRecordAttempt && this.activityPurpose) {
    this.purposeOfRecordAttempt = this.activityPurpose;
  }
  if (!this.recordVenue && this.activityVenue) {
    this.recordVenue = this.activityVenue;
  }
  if (!this.dateOfAttempt && this.attemptDate) {
    this.dateOfAttempt = this.attemptDate;
  }

  // Sync approved flag with status
  if (this.status === 'Approved') {
    this.approved = true;
  } else if (this.status === 'Pending') {
    this.approved = false;
  }
});

module.exports = mongoose.model('URU', uruSchema);
