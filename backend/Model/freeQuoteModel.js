const mongoose = require('mongoose');

const freeQuoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number },
    designation: { type: String, trim: true },
    address: { type: String, trim: true },
    message: { type: String, required: true },

    // NEW FIELD
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FreeQuote', freeQuoteSchema);
