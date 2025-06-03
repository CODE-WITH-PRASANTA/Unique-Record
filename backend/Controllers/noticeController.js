const Notice = require("../Model/Notice");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");

// Cloudinary Upload Function
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder: "notices" });
    fs.unlinkSync(filePath); // Remove file after upload
    return result.secure_url;
  } catch (error) {
    throw new Error("File upload failed");
  }
};

// Get All Notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ postingDate: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Notice
exports.addNotice = async (req, res) => {
  try {
    const { title, description, postingDate, postOwner, link } = req.body;

    if (!title || !description || !postOwner) {
      return res.status(400).json({ message: "Title, description, and post owner are required" });
    }

    if (!req.files || !req.files.photo) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const photoUrl = await uploadToCloudinary(req.files.photo[0].path);
    let otherFilesUrl = null;

    if (req.files.otherFiles) {
      otherFilesUrl = await uploadToCloudinary(req.files.otherFiles[0].path);
    }

    const notice = new Notice({
      title,
      description,
      postingDate: postingDate || Date.now(),
      postOwner,
      link,
      photo: photoUrl,
      otherFiles: otherFilesUrl,
    });

    await notice.save();
    res.status(201).json({ message: "Notice added successfully", notice });
  } catch (error) {
    console.error("Error adding notice:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cloudinary Delete Function
const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    const publicId = fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`notices/${publicId}`);
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};

// Update Notice
exports.updateNotice = async (req, res) => {
  try {
    const { title, description, postingDate, postOwner, link } = req.body;
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Upload new files if provided
    let photoUrl = notice.photo;
    let otherFilesUrl = notice.otherFiles;

    if (req.files?.photo) {
      await deleteFromCloudinary(notice.photo);
      photoUrl = await uploadToCloudinary(req.files.photo[0].path);
    }

    if (req.files?.otherFiles) {
      await deleteFromCloudinary(notice.otherFiles);
      otherFilesUrl = await uploadToCloudinary(req.files.otherFiles[0].path);
    }

    notice.title = title || notice.title;
    notice.description = description || notice.description;
    notice.postingDate = postingDate || notice.postingDate;
    notice.postOwner = postOwner || notice.postOwner;
    notice.link = link || notice.link;
    notice.photo = photoUrl;
    notice.otherFiles = otherFilesUrl;

    await notice.save();
    res.status(200).json({ message: "Notice updated successfully", notice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Delete images from Cloudinary
    await deleteFromCloudinary(notice.photo);
    await deleteFromCloudinary(notice.otherFiles);

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

