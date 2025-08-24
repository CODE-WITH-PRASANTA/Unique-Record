const express = require("express");
const {
  subscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
} = require("../Controllers/newsletterController");

const router = express.Router();

// POST - Subscribe
router.post("/subscribe", subscribeNewsletter);

// GET - Fetch all subscribers (admin)
router.get("/", getSubscribers);

// DELETE - Remove subscriber by ID (admin)
router.delete("/:id", deleteSubscriber);

module.exports = router;
