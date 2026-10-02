const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventsByStatus,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { upload, convertEventImageToWebp } = require('../middleware/eventUploadMiddleware');

// List & Create
router.get('/', getAllEvents);
router.get('/all', getAllEvents);
router.post('/', upload.single('locationImage'), convertEventImageToWebp, createEvent);
router.post('/add', upload.single('locationImage'), convertEventImageToWebp, createEvent);
router.post('/create', upload.single('locationImage'), convertEventImageToWebp, createEvent);

// Status filter for Frontend
router.get('/status/:status', getEventsByStatus);

// Single Item Operations
router
  .route('/:id')
  .get(getEventById)
  .put(upload.single('locationImage'), convertEventImageToWebp, updateEvent)
  .delete(deleteEvent);

module.exports = router;
