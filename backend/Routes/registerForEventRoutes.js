const express = require("express");
const router = express.Router();
const { registerForEvent, getAllRegistrations, getRegistrationById , sendRegistrationEmail } = require("../Controllers/registerForEventController");

// Route to register for an event
router.post("/register", registerForEvent);

// Route to get all registrations
router.get("/registrations", getAllRegistrations);

// Route to get a single registration by ID
router.get("/registrations/:id", getRegistrationById);

router.post("/registrations/:id/send-email", sendRegistrationEmail);


module.exports = router;
