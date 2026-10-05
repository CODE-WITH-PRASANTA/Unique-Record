const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image for the gallery'],
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
      default: function () {
        return this.imageUrl || '';
      },
    },
    instagram: {
      type: String,
      trim: true,
      default: '',
    },
    facebook: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'Events',
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

// Pre-save hook to ensure imageUrl and photoUrl stay in sync
gallerySchema.pre('save', function () {
  if (this.imageUrl && !this.photoUrl) {
    this.photoUrl = this.imageUrl;
  } else if (this.photoUrl && !this.imageUrl) {
    this.imageUrl = this.photoUrl;
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
