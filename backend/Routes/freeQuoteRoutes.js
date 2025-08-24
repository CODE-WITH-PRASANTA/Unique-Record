const express = require('express');
const { createFreeQuote, getAllFreeQuotes, deleteFreeQuote } = require('../Controllers/freeQuoteController');

const router = express.Router();

// POST -> Create a new Free Quote
router.post('/create', createFreeQuote);

// GET -> Get all Free Quotes
router.get('/', getAllFreeQuotes);

// DELETE -> Delete a Free Quote by ID
router.delete('/:id', deleteFreeQuote);

module.exports = router;
