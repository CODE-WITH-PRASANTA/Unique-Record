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
const { adminOnly } = require('../middleware/authMiddleware');

// List & Create
router.get('/', getAllEvents);
router.get('/all', getAllEvents);
router.post('/', adminOnly, upload.single('locationImage'), convertEventImageToWebp, createEvent);
router.post('/add', adminOnly, upload.single('locationImage'), convertEventImageToWebp, createEvent);
router.post('/create', adminOnly, upload.single('locationImage'), convertEventImageToWebp, createEvent);

// Status filter for Frontend
router.get('/status/:status', getEventsByStatus);

// Single Item Operations
router
  .route('/:id')
  .get(getEventById)
  .put(adminOnly, upload.single('locationImage'), convertEventImageToWebp, updateEvent)
  .delete(adminOnly, deleteEvent);

module.exports = router;
