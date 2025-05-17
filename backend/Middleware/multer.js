const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo" && !file.mimetype.startsWith("image/")) {
    return cb(new Error("Only images are allowed for photo!"), false);
  }

  if (file.fieldname === "video" && !file.mimetype.startsWith("video/")) {
    return cb(new Error("Only videos are allowed for video!"), false);
  }

  if (file.fieldname === "document" && file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDFs are allowed for document!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
});

module.exports = upload;