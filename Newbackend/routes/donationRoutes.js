const express = require('express');
const router = express.Router();

const {
  createDonationOrder,
  verifyDonationPayment,
  getAllDonations,
  getDonationById,
  deleteDonation,
  processDonationRefund,
  syncRazorpayDonationsController,
  handleRazorpayWebhook,
  sendDonationReceiptEmailController,
} = require('../controllers/donationController');

const { adminOnly } = require('../middleware/authMiddleware');

// Razorpay Order Creation & Verification (Public)
router.post('/create-order', createDonationOrder);
router.post('/verify-payment', verifyDonationPayment);

// List all donations (Public for Charity List on Frontend / Admin)
router.get('/', getAllDonations);
router.get('/all', getAllDonations);
router.get('/public', getAllDonations);

// Sync missing captured donations from Razorpay
router.get('/sync-razorpay', syncRazorpayDonationsController);
router.post('/sync-razorpay', syncRazorpayDonationsController);

// Razorpay Webhook (Public callback from Razorpay)
router.post('/webhook', handleRazorpayWebhook);

// Resend donation confirmation receipt email (Public / Admin)
router.post('/:id/send-email', sendDonationReceiptEmailController);
router.post('/send-receipt-email', sendDonationReceiptEmailController);

// Single donation operations & delete (Admin Only for delete)
router.get('/:id', getDonationById);
router.delete('/:id', adminOnly, deleteDonation);
router.delete('/delete/:donationId', adminOnly, deleteDonation);

// Refund (Admin Only)
router.post('/:id/refund', adminOnly, processDonationRefund);
router.post('/refund/:id', adminOnly, processDonationRefund);

module.exports = router;

