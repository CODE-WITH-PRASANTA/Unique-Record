const express = require("express");
const router = express.Router();

const {
  registerForEvent,
  getAllRegistrations,
  getRegistrationById,
  sendRegistrationEmail,
  trackEventStatus,
  deleteRegistration,
} = require("../Controllers/registerForEventController");

// Route to register for an event
router.post("/register", registerForEvent);

// Route to get all registrations
router.get("/registrations", getAllRegistrations);

// Route to get a single registration by ID
router.get("/registrations/:id", getRegistrationById);

// Route to send registration email
router.post("/registrations/:id/send-email", sendRegistrationEmail);

// Track event status by application number (public)
router.get("/track/:applicationNumber", trackEventStatus);

// Route to delete a registration completely (Admin only)
router.delete("/registrations/:id", deleteRegistration);

module.exports = router;
