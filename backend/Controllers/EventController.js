const Event = require("../Model/EventModel");
const cloudinary = require("../Config/cloudinary");

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventLocation,
      eventDate,
      eventDescription,
      eventOrganizer,
      openingDate,
      closingDate,
      pricePerTicket,
      category,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Event image is required!" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "events",
    });

    const newEvent = new Event({
      eventName,
      eventLocation,
      eventDate,
      eventDescription,
      eventOrganizer,
      openingDate,
      closingDate,
      pricePerTicket,
      category,
      eventImage: result.secure_url, // Save Cloudinary URL
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully!", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all events with category-based filtering
exports.getAllEvents = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ message: "Events fetched successfully!", events });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch events by category
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!["Top Category", "Normal"].includes(category)) {
      return res.status(400).json({ message: "Invalid category!" });
    }

    const events = await Event.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({ message: `Events in ${category} fetched successfully!`, events });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update an event (without changing image unless new one is uploaded)
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found!" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
      });
      updateData.eventImage = result.secure_url;
    } else {
      updateData.eventImage = existingEvent.eventImage;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }

    // Remove image from Cloudinary
    const imageUrl = event.eventImage;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID
    await cloudinary.uploader.destroy(`events/${publicId}`);

    // Remove event from database
    await Event.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
