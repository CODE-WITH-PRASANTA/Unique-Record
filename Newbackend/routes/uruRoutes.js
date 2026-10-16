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

// Get all applications (Admin / Optional Auth)
router.get('/all', optionalAuth, uruController.getAllUru);
router.get('/manage', optionalAuth, uruController.getAllUru);
router.get('/get-all-uru', optionalAuth, uruController.getAllUru);
router.get('/', optionalAuth, uruController.getAllUru);

// User-specific applications (Authenticated User)
router.get('/user', protect, uruController.fetchAppliedUruByUser);
router.get('/fetch-applied-uru-by-user', protect, uruController.fetchAppliedUruByUser);

// Approved applications for /uru/approve (Admin / Optional Auth)
router.get('/approved', optionalAuth, uruController.fetchApprovedUru);
router.get('/fetch-approved-uru', optionalAuth, uruController.fetchApprovedUru);

// Final URU / Paid applications for /uru/final (Admin / Optional Auth)
router.get('/paid', optionalAuth, uruController.fetchPaidUru);
router.get('/final', optionalAuth, uruController.fetchPaidUru);
router.get('/fetch-paid-uru', optionalAuth, uruController.fetchPaidUru);

// Certificate Upload (Optional Auth / Admin)
router.post('/upload-certificate/:id', optionalAuth, uruUpload.single('certificate'), uruController.uploadCertificate);
router.post('/:id/certificate', optionalAuth, uruUpload.single('certificate'), uruController.uploadCertificate);

// Publish Status (Optional Auth / Admin)
router.put('/publish-uru/:id', optionalAuth, uruController.updatePublishStatus);
router.patch('/publish-uru/:id', optionalAuth, uruController.updatePublishStatus);
router.patch('/:id/publish', optionalAuth, uruController.updatePublishStatus);
router.put('/:id/publish', optionalAuth, uruController.updatePublishStatus);
router.get('/published', uruController.fetchPublishedUru);
router.get('/published/:id', uruController.fetchPublishedUruById);
router.get('/fetch-published-uru', uruController.fetchPublishedUru);
router.get('/fetch-published-uru/:id', uruController.fetchPublishedUruById);

// Paid approval (Optional Auth / Admin)
router.put('/give-paid-approve/:id', optionalAuth, uruController.givePaidApprove);
router.patch('/give-paid-approve/:id', optionalAuth, uruController.givePaidApprove);
router.patch('/:id/paid-approve', optionalAuth, uruController.givePaidApprove);
router.put('/:id/paid-approve', optionalAuth, uruController.givePaidApprove);

// Payment reminder (Optional Auth / Admin)
router.post('/send-reminders', optionalAuth, uruController.sendPaymentReminder);
router.post('/send-reminder', optionalAuth, uruController.sendPaymentReminder);

// Razorpay Payment Gateway Endpoints
router.get('/razorpay-key', uruController.getRazorpayKey);
router.post('/create-razorpay-order', uruController.createRazorpayOrder);
router.post('/verify-razorpay-payment', uruController.verifyRazorpayPayment);

// Price update (Optional Auth / Admin)
router.put('/update-price', optionalAuth, uruController.updatePrice);
router.post('/update-price', optionalAuth, uruController.updatePrice);

// Approval toggle / status update (Optional Auth / Admin)
router.patch('/:id/approve', optionalAuth, uruController.toggleApproveUru);
router.put('/:id/approve', optionalAuth, uruController.toggleApproveUru);
router.patch('/approve/:id', optionalAuth, uruController.toggleApproveUru);
router.put('/approve/:id', optionalAuth, uruController.toggleApproveUru);
router.put('/approve-uru/:id', optionalAuth, uruController.toggleApproveUru);
router.patch('/approve-uru/:id', optionalAuth, uruController.toggleApproveUru);

// Get single application
router.get('/get-uru-by-id/:id', optionalAuth, uruController.getUruById);
router.get('/:id', optionalAuth, uruController.getUruById);

// Update single application (Optional Auth / Admin)
router.put('/update-uru/:id', optionalAuth, uploadFields, uruController.updateUru);
router.put('/:id', optionalAuth, uploadFields, uruController.updateUru);
router.patch('/:id', optionalAuth, uploadFields, uruController.updateUru);

// Delete application (Optional Auth / Admin)
router.delete('/delete-uru/:id', optionalAuth, uruController.deleteUru);
router.delete('/:id', optionalAuth, uruController.deleteUru);

module.exports = router;
