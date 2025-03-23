const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true }, // Unique User ID
    lastLogin: { type: Date, default: null } // Last login timestamp
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
