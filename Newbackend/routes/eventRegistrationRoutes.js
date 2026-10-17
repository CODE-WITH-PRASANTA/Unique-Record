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
const { adminOnly, optionalAuth } = require('../middleware/authMiddleware');

// Payment & Refund Gateway Routes
router.post('/create-order', createEventRazorpayOrder);
router.post('/verify-payment', verifyEventPayment);
router.post('/:id/refund', adminOnly, processEventRefund);
router.post('/refund/:id', adminOnly, processEventRefund);

// Public tracking routes
router.get('/track/:appNumber', trackRegistrationStatus);
router.get('/status/:appNumber', trackRegistrationStatus);

// List & Register routes
router.get('/', optionalAuth, getAllEventRegistrations);
router.get('/all', optionalAuth, getAllEventRegistrations);
router.post('/', optionalAuth, uploadEventRegFiles, registerForEvent);
router.post('/register', optionalAuth, uploadEventRegFiles, registerForEvent);
router.post('/add', optionalAuth, uploadEventRegFiles, registerForEvent);

// Status update (Admin Only)
router.patch('/:id/status', adminOnly, updateEventRegistrationStatus);

// Single record operations (Admin Only for destructive edits)
router
  .route('/:id')
  .get(optionalAuth, getEventRegistrationById)
  .put(adminOnly, updateEventRegistrationStatus)
  .patch(adminOnly, updateEventRegistrationStatus)
  .delete(adminOnly, deleteEventRegistration);

module.exports = router;
