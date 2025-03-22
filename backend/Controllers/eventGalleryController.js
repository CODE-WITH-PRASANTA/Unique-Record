const EventGallery = require("../Model/EventGallery");
const cloudinary = require("../Config/cloudinary");

// Upload event image to Cloudinary and save details to MongoDB
exports.uploadEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "event_gallery",
    });

    // Save to DB
    const newEvent = new EventGallery({
      imageUrl: cloudinaryResponse.secure_url,
      instagram: req.body.instagram || "",
      facebook: req.body.facebook || "",
    });

    await newEvent.save();
    res.status(201).json({ message: "Event uploaded successfully", data: newEvent });

  } catch (error) {
    res.status(500).json({ message: "Error uploading event", error });
  }
};

// Fetch all event images
exports.getEvents = async (req, res) => {
  try {
    const events = await EventGallery.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};
exports.deleteEvent = async (req, res) => {
    try {
      const event = await EventGallery.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Extract Cloudinary public ID properly
      const publicIdMatch = event.imageUrl.match(/\/([^/]+)\.[^.]+$/);
      if (!publicIdMatch) {
        return res.status(500).json({ message: "Error extracting public ID" });
      }
      const publicId = publicIdMatch[1];
  
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(`event_gallery/${publicId}`);
  
      // Delete from Database
      await EventGallery.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error });
    }
  };
  