const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

eventCategorySchema.pre('save', function (next) {
  if (this.isModified('name') && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('EventCategory', eventCategorySchema);
