const express = require("express");
const upload = require("../Middleware/multer");
const { uploadFiles } = require("../Controllers/uploadController");

const router = express.Router();

// Upload Route
router.post("/upload", upload.fields([
  { name: "biodata", maxCount: 1 }, 
  { name: "photo", maxCount: 1 }
]), uploadFiles);

module.exports = router;
