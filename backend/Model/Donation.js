const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  certificate: { type: String, required: true },
  address: { type: String, required: true },
  extra: { type: String },
  paymentId: { type: String },
  orderId: { type: String },
  signature: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
