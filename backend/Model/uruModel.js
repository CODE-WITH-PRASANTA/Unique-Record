const mongoose = require("mongoose");

const uruSchema = new mongoose.Schema({
  position: { type: String },
  userId: { type: String, required: true },
  applicationNumber: { type: String },
  applicantName: { type: String, required: true },
  sex: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  educationalQualification: { type: String, required: true },
  whatsappMobileNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  occupation: { type: String, required: true },
  recordCategory: { type: String, required: true },
  recordTitle: { type: String, required: true },
  recordDescription: { type: String, required: true },
  purposeOfRecordAttempt: { type: String, required: true },
  dateOfAttempt: { type: Date, required: true },
  recordVenue: { type: String, required: true },
  organisationName: { type: String },
  googleDriveLink: { type: String },
  facebookLink: { type: String },
  youtubeLink: { type: String },
  instagramLink: { type: String },
  linkedInLink: { type: String },
  xLink: { type: String },
  pinterestLink: { type: String },
  otherMediaLink: { type: String },
  photoUrl: { type: String },
  videoUrl: { type: String },
  documentUrl: { type: String },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected", "Paid"], 
    default: "Pending" 
  },
  price: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ["Success", "Failed", "Pending"],
    default: "Pending",
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  priceUpdated: { type: Boolean, default: false },
  priceUpdatedDate: { type: String },
  approvedDate: { type: Date },

  witness1: {
    name: { type: String },
    designation: { type: String },
    address: { type: String },
    mobileNumber: { type: String },
    emailId: { type: String },
  },
  witness2: {
    name: { type: String },
    designation: { type: String },
    address: { type: String },
    mobileNumber: { type: String },
    emailId: { type: String },
  },
  certificateUrl: { type: String },

  // 🔥 NEW FIELD
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("URU", uruSchema);
