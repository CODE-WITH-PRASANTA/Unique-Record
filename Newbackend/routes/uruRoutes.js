const express = require('express');
const router = express.Router();
const uruController = require('../controllers/uruController');
const uruUpload = require('../middleware/uruUploadMiddleware');

// Multer upload fields definition
const uploadFields = uruUpload.fields([
  { name: 'photos', maxCount: 15 },
  { name: 'videos', maxCount: 5 },
  { name: 'documents', maxCount: 10 },
  { name: 'certificate', maxCount: 1 },
]);

// Create URU application (Supports multipart/form-data & application/json)
router.post('/apply', uploadFields, uruController.createUru);
router.post('/create-uru', uploadFields, uruController.createUru);
router.post('/', uploadFields, uruController.createUru);

// Get all applications (Admin / Manage URU)
router.get('/all', uruController.getAllUru);
router.get('/manage', uruController.getAllUru);
router.get('/get-all-uru', uruController.getAllUru);
router.get('/', uruController.getAllUru);

// User-specific applications
router.get('/user', uruController.fetchAppliedUruByUser);
router.get('/fetch-applied-uru-by-user', uruController.fetchAppliedUruByUser);

// Approved applications for /uru/approve
router.get('/approved', uruController.fetchApprovedUru);
router.get('/fetch-approved-uru', uruController.fetchApprovedUru);

// Final URU / Paid applications for /uru/final
router.get('/paid', uruController.fetchPaidUru);
router.get('/final', uruController.fetchPaidUru);
router.get('/fetch-paid-uru', uruController.fetchPaidUru);

// Certificate Upload
router.post('/upload-certificate/:id', uruUpload.single('certificate'), uruController.uploadCertificate);
router.post('/:id/certificate', uruUpload.single('certificate'), uruController.uploadCertificate);

// Publish Status
router.put('/publish-uru/:id', uruController.updatePublishStatus);
router.patch('/:id/publish', uruController.updatePublishStatus);
router.get('/published', uruController.fetchPublishedUru);
router.get('/published/:id', uruController.fetchPublishedUruById);
router.get('/fetch-published-uru', uruController.fetchPublishedUru);
router.get('/fetch-published-uru/:id', uruController.fetchPublishedUruById);

// Paid approval
router.put('/give-paid-approve/:id', uruController.givePaidApprove);
router.patch('/:id/paid-approve', uruController.givePaidApprove);

// Payment reminder
router.post('/send-reminders', uruController.sendPaymentReminder);
router.post('/send-reminder', uruController.sendPaymentReminder);

// Razorpay Payment Gateway Endpoints
router.get('/razorpay-key', uruController.getRazorpayKey);
router.post('/create-razorpay-order', uruController.createRazorpayOrder);
router.post('/verify-razorpay-payment', uruController.verifyRazorpayPayment);

// Price update
router.put('/update-price', uruController.updatePrice);

// Approval toggle / status update
router.patch('/:id/approve', uruController.toggleApproveUru);
router.put('/approve-uru/:id', uruController.toggleApproveUru);

// Get single application
router.get('/get-uru-by-id/:id', uruController.getUruById);
router.get('/:id', uruController.getUruById);

// Update single application
router.put('/update-uru/:id', uploadFields, uruController.updateUru);
router.put('/:id', uploadFields, uruController.updateUru);
router.patch('/:id', uploadFields, uruController.updateUru);

// Delete application
router.delete('/delete-uru/:id', uruController.deleteUru);
router.delete('/:id', uruController.deleteUru);

module.exports = router;
