const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const {
  uploadHomeMedia,
  getHomeMedia,
  deleteHomeMedia,
} = require("../Controllers/homeMediaController");

// POST - Upload Images
router.post("/upload", upload.array("images", 10), uploadHomeMedia);

// GET - Fetch Images
router.get("/all", getHomeMedia);

// DELETE - Delete Image
router.delete("/:id", deleteHomeMedia);

module.exports = router;
