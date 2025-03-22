const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventDescription: { type: String, required: true },
  eventOrganizer: { type: String, required: true },
  openingDate: { type: Date, required: true },
  closingDate: { type: Date, required: true },
  currentStatus: { type: String, enum: ["Ongoing", "Date Over"], default: "Ongoing" },
  pricePerTicket: { type: Number, required: true },
  category: { type: String, enum: ["Top Category", "Normal"], default: "Top Category" },
  eventImage: { type: String, required: true }, // Cloudinary image URL
}, { timestamps: true });

// Middleware to update event status before saving
EventSchema.pre("save", function (next) {
  const today = new Date();
  if (this.closingDate < today) {
    this.currentStatus = "Date Over";
  }
  next();
});

module.exports = mongoose.model("Event", EventSchema);
