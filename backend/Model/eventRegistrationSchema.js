const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  applicantName: { type: String, required: true },
  sex: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  phone: { type: String, required: true },
  pinCode: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: false },
  education: { type: String, required: true },
  skills: { type: String, required: true },
  bioDataUrl: { type: String, required: true },
  passportPhotoUrl: { type: String, required: true },
  payment: {
    orderId: { type: String, required: true },
    paymentId: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  },
}, { timestamps: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
