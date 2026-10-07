const express = require('express');
const router = express.Router();

const {
  createEventRazorpayOrder,
  verifyEventPayment,
  registerForEvent,
  processEventRefund,
  trackRegistrationStatus,
  getAllEventRegistrations,
  getEventRegistrationById,
  updateEventRegistrationStatus,
  deleteEventRegistration,
} = require('../controllers/eventRegistrationController');
const { uploadEventRegFiles } = require('../middleware/eventRegistrationUploadMiddleware');

// Payment & Refund Gateway Routes
router.post('/create-order', createEventRazorpayOrder);
router.post('/verify-payment', verifyEventPayment);
router.post('/:id/refund', processEventRefund);
router.post('/refund/:id', processEventRefund);

// Public tracking routes
router.get('/track/:appNumber', trackRegistrationStatus);
router.get('/status/:appNumber', trackRegistrationStatus);

// List & Register routes
router.get('/', getAllEventRegistrations);
router.get('/all', getAllEventRegistrations);
router.post('/', uploadEventRegFiles, registerForEvent);
router.post('/register', uploadEventRegFiles, registerForEvent);
router.post('/add', uploadEventRegFiles, registerForEvent);

// Status update
router.patch('/:id/status', updateEventRegistrationStatus);

// Single record operations
router
  .route('/:id')
  .get(getEventRegistrationById)
  .put(updateEventRegistrationStatus)
  .patch(updateEventRegistrationStatus)
  .delete(deleteEventRegistration);

module.exports = router;
