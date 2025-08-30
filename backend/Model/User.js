const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, unique: true, trim: true }, // must be String
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  uniqueId: { type: String, unique: true },
  tokens: { type: [String], default: [] },
  lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
