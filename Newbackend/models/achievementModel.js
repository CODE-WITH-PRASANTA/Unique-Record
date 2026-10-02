const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: false,
      trim: true,
    },
    shortDesc: {
      type: String,
      required: false,
      trim: true,
    },
    content: {
      type: String,
      required: false,
    },
    providerName: {
      type: String,
      required: false,
      trim: true,
      default: 'Unique Record',
    },
    achieverName: {
      type: String,
      required: [true, 'Please add achiever name'],
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
      default: 'General',
    },
    effortType: {
      type: String,
      required: false,
      trim: true,
      default: 'Individual',
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    uruHolderLink: {
      type: String,
      required: false,
      trim: true,
    },
    holderLink: {
      type: String,
      required: false,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: false,
      default: '',
    },
    imageUrl: {
      type: String,
      required: false,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Active', 'Inactive'],
      default: 'Published',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save synchronization for alias fields
achievementSchema.pre('save', function (next) {
  if (this.shortDesc && !this.shortDescription) {
    this.shortDescription = this.shortDesc;
  } else if (this.shortDescription && !this.shortDesc) {
    this.shortDesc = this.shortDescription;
  }

  if (this.holderLink && !this.uruHolderLink) {
    this.uruHolderLink = this.holderLink;
  } else if (this.uruHolderLink && !this.holderLink) {
    this.holderLink = this.uruHolderLink;
  }

  if (this.imageUrl && !this.image) {
    this.image = this.imageUrl;
  } else if (this.image && !this.imageUrl) {
    this.imageUrl = this.image;
  }

  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }

  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);
