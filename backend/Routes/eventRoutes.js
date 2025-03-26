const express = require("express");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  getEventsByCategory,
  getEventsByStatus,  // New function
  deleteEvent
} = require("../Controllers/EventController");
const upload = require("../Middleware/multer");

const router = express.Router();

router.post("/create", upload.single("eventImage"), createEvent);
router.get("/all", getAllEvents);
router.get("/category/:category", getEventsByCategory);
router.get("/status/:status", getEventsByStatus);  // New route
router.put("/update/:id", upload.single("eventImage"), updateEvent);
router.delete("/delete/:id", deleteEvent);

module.exports = router;
