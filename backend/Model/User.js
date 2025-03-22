const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
