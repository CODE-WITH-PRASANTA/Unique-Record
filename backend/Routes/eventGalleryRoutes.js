const express = require("express");
const upload = require("../Middleware/multer");
const { uploadEvent, getEvents, deleteEvent } = require("../Controllers/eventGalleryController");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadEvent);
router.get("/", getEvents);
router.delete("/:id", deleteEvent);

module.exports = router;
