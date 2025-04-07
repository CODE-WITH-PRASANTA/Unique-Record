const cloudinary = require("../Config/cloudinary");

const uploadFiles = async (req, res) => {
  try {
    if (!req.files || !req.files.biodata || !req.files.photo) {
      return res.status(400).json({ message: "Both biodata and photo files are required." });
    }

    // Upload biodata (PDF or Image)
    const bioDataResult = await cloudinary.uploader.upload(req.files.biodata[0].path, {
      resource_type: "auto",
      folder: "event_registrations",
    });

    // Upload photo (Only Image)
    const photoResult = await cloudinary.uploader.upload(req.files.photo[0].path, {
      resource_type: "image",
      folder: "event_registrations",
    });

    res.status(200).json({
      message: "Files uploaded successfully",
      biodataUrl: bioDataResult.secure_url,
      photoUrl: photoResult.secure_url,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
};

module.exports = { uploadFiles };
