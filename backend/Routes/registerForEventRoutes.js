const express = require("express");
const router = express.Router();
const { registerForEvent } = require("../Controllers/registerForEventController");

router.post("/register", registerForEvent); // Register event route

module.exports = router;
