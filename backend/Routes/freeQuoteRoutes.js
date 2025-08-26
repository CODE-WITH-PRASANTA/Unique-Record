const express = require("express");
const router = express.Router();
const {
  createFreeQuote,
  getAllFreeQuotes,
  getPublishedFreeQuotes,
  togglePublishFreeQuote,
  deleteFreeQuote,
} = require("../Controllers/freeQuoteController");

// ✅ Route for creating quote
router.post("/create", createFreeQuote);

// Get all quotes (admin)
router.get("/", getAllFreeQuotes);

// Get only published quotes (public)
router.get("/published", getPublishedFreeQuotes);

// Publish/Unpublish quote
router.put("/:id/publish", togglePublishFreeQuote);

// Delete quote
router.delete("/:id", deleteFreeQuote);

module.exports = router;
