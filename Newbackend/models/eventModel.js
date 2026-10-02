const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    eventLocation: {
      type: String,
      trim: true,
    },
    locationImage: {
      type: String,
      default: '',
    },
    eventImage: {
      type: String,
      default: '',
    },
    eventDate: {
      type: String,
      required: [true, 'Event date is required'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    eventDescription: {
      type: String,
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    eventOrganizer: {
      type: String,
      trim: true,
    },
    openingDate: {
      type: String,
      required: [true, 'Opening date is required'],
    },
    closingDate: {
      type: String,
      required: [true, 'Closing date is required'],
    },
    status: {
      type: String,
      enum: ['Ongoing', 'Upcoming', 'Completed', 'Cancelled', 'Date Over'],
      default: 'Ongoing',
    },
    currentStatus: {
      type: String,
      default: 'Ongoing',
    },
    registrationFee: {
      type: String,
      default: '0',
    },
    pricePerTicket: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'Top Category',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto sync alias fields before saving
eventSchema.pre('save', function () {
  if (this.location && !this.eventLocation) this.eventLocation = this.location;
  if (this.eventLocation && !this.location) this.location = this.eventLocation;

  if (this.locationImage && !this.eventImage) this.eventImage = this.locationImage;
  if (this.eventImage && !this.locationImage) this.locationImage = this.eventImage;

  if (this.description && !this.eventDescription) this.eventDescription = this.description;
  if (this.eventDescription && !this.description) this.description = this.eventDescription;

  if (this.organizer && !this.eventOrganizer) this.eventOrganizer = this.organizer;
  if (this.eventOrganizer && !this.organizer) this.organizer = this.eventOrganizer;

  if (this.status && !this.currentStatus) this.currentStatus = this.status;
  if (this.currentStatus && !this.status) this.status = this.currentStatus;

  if (this.registrationFee !== undefined) {
    this.pricePerTicket = Number(this.registrationFee) || 0;
  }
});

module.exports = mongoose.model('Event', eventSchema);
