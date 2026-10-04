const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    uniqueId: {
      type: String,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Blocked'],
      default: 'Active',
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordOtpExpire: {
      type: Date,
      default: null,
    },
    tokens: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'users', // Explicitly store in the 'users' MongoDB collection (table)
  }
);

// Pre-save hook: auto-generate uniqueId if missing and hash password
userSchema.pre('save', async function () {
  if (!this.uniqueId) {
    this.uniqueId = `${new Date().getFullYear().toString().slice(2)}OS${crypto.randomInt(100000, 999999)}`;
  }

  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
