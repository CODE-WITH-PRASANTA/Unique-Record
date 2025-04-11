const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const photoController = require("../Controllers/photoController");

// Upload route
router.post("/upload", upload.array("photos", 10), photoController.uploadPhotos);

// Get all photos
router.get("/", photoController.getPhotos);

// Delete photo
router.delete("/:id", photoController.deletePhoto);

module.exports = router;
