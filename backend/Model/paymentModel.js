const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String, default: null },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
