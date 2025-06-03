const cloudinary = require("../Config/cloudinary");
const Photo = require("../Model/Photo");
const fs = require("fs");

exports.uploadPhotos = async (req, res) => {
  try {
    const { category, link } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No photos uploaded" });
    }

    const photoPromises = files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "photo-manager",
      });

      fs.unlinkSync(file.path); // remove local file after upload

      return {
        category,
        link,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    });

    const photosData = await Promise.all(photoPromises);
    const savedPhotos = await Photo.insertMany(photosData);

    res.status(201).json(savedPhotos);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getPhotos = async (req, res) => {
    try {
      const { category } = req.query;
      const filter = category && category !== "All Photos" ? { category } : {};
      const photos = await Photo.find(filter).sort({ createdAt: -1 });
      res.json(photos);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  };

  
  exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);

    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(photo.publicId);
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
    }

    // Delete from DB
    await Photo.findByIdAndDelete(id);

    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err); 
    res.status(500).json({ error: "Failed to delete photo" });
  }
};