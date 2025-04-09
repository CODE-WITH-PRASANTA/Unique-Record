const HomeMedia = require("../Model/HomeMedia");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");

exports.uploadHomeMedia = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const uploadedData = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "home_media",
      });

      // Save to DB
      const media = new HomeMedia({
        name: file.originalname,
        url: result.secure_url,
      });

      await media.save();

      uploadedData.push(media);

      // Delete local file
      fs.unlinkSync(file.path);
    }

    res.status(201).json(uploadedData);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload." });
  }
};

exports.deleteHomeMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await HomeMedia.findById(id);
    if (!media) return res.status(404).json({ message: "Media not found." });

    // Extract public_id from the Cloudinary URL
    const urlParts = media.url.split("/");
    const filenameWithExtension = urlParts[urlParts.length - 1]; // e.g., abc123.jpg
    const publicId = `home_media/${filenameWithExtension.split(".")[0]}`; // e.g., home_media/abc123

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary deletion error:", error);
        return res.status(500).json({ message: "Cloudinary deletion failed." });
      }
    });

    // Delete from MongoDB
    await media.deleteOne();

    res.json({ message: "Media deleted permanently from DB and Cloudinary." });
  } catch (err) {
    console.error("Deletion error:", err);
    res.status(500).json({ message: "Server error during deletion." });
  }
};


exports.getHomeMedia = async (req, res) => {
  try {
    const media = await HomeMedia.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Error fetching media." });
  }
};