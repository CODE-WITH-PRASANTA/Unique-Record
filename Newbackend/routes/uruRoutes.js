const express = require('express');
const router = express.Router();
const uruController = require('../controllers/uruController');
const uruUpload = require('../middleware/uruUploadMiddleware');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

// Multer upload fields definition
const uploadFields = uruUpload.fields([
  { name: 'photos', maxCount: 15 },
  { name: 'videos', maxCount: 5 },
  { name: 'documents', maxCount: 10 },
  { name: 'certificate', maxCount: 1 },
]);

// Create URU application (Supports multipart/form-data & application/json)
router.post('/apply', optionalAuth, uploadFields, uruController.createUru);
router.post('/create-uru', optionalAuth, uploadFields, uruController.createUru);
router.post('/', optionalAuth, uploadFields, uruController.createUru);

// Get all applications (Admin Only)
router.get('/all', adminOnly, uruController.getAllUru);
router.get('/manage', adminOnly, uruController.getAllUru);
router.get('/get-all-uru', adminOnly, uruController.getAllUru);
router.get('/', adminOnly, uruController.getAllUru);

// User-specific applications (Authenticated User)
router.get('/user', protect, uruController.fetchAppliedUruByUser);
router.get('/fetch-applied-uru-by-user', protect, uruController.fetchAppliedUruByUser);

// Approved applications for /uru/approve (Admin Only)
router.get('/approved', adminOnly, uruController.fetchApprovedUru);
router.get('/fetch-approved-uru', adminOnly, uruController.fetchApprovedUru);

// Final URU / Paid applications for /uru/final (Admin Only)
router.get('/paid', adminOnly, uruController.fetchPaidUru);
router.get('/final', adminOnly, uruController.fetchPaidUru);
router.get('/fetch-paid-uru', adminOnly, uruController.fetchPaidUru);

// Certificate Upload (Admin Only)
router.post('/upload-certificate/:id', adminOnly, uruUpload.single('certificate'), uruController.uploadCertificate);
router.post('/:id/certificate', adminOnly, uruUpload.single('certificate'), uruController.uploadCertificate);

// Publish Status
router.put('/publish-uru/:id', adminOnly, uruController.updatePublishStatus);
router.patch('/:id/publish', adminOnly, uruController.updatePublishStatus);
router.get('/published', uruController.fetchPublishedUru);
router.get('/published/:id', uruController.fetchPublishedUruById);
router.get('/fetch-published-uru', uruController.fetchPublishedUru);
router.get('/fetch-published-uru/:id', uruController.fetchPublishedUruById);

// Paid approval (Admin Only)
router.put('/give-paid-approve/:id', adminOnly, uruController.givePaidApprove);
router.patch('/:id/paid-approve', adminOnly, uruController.givePaidApprove);

// Payment reminder (Admin Only)
router.post('/send-reminders', adminOnly, uruController.sendPaymentReminder);
router.post('/send-reminder', adminOnly, uruController.sendPaymentReminder);

// Razorpay Payment Gateway Endpoints
router.get('/razorpay-key', uruController.getRazorpayKey);
router.post('/create-razorpay-order', uruController.createRazorpayOrder);
router.post('/verify-razorpay-payment', uruController.verifyRazorpayPayment);

// Price update (Admin Only)
router.put('/update-price', adminOnly, uruController.updatePrice);

// Approval toggle / status update (Admin Only)
router.patch('/:id/approve', adminOnly, uruController.toggleApproveUru);
router.put('/approve-uru/:id', adminOnly, uruController.toggleApproveUru);

// Get single application
router.get('/get-uru-by-id/:id', uruController.getUruById);
router.get('/:id', uruController.getUruById);

// Update single application (Admin Only)
router.put('/update-uru/:id', adminOnly, uploadFields, uruController.updateUru);
router.put('/:id', adminOnly, uploadFields, uruController.updateUru);
router.patch('/:id', adminOnly, uploadFields, uruController.updateUru);

// Delete application (Admin Only)
router.delete('/delete-uru/:id', adminOnly, uruController.deleteUru);
router.delete('/:id', adminOnly, uruController.deleteUru);

module.exports = router;
