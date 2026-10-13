const express = require('express');
const router = express.Router();

const {
  createDonationOrder,
  verifyDonationPayment,
  getAllDonations,
  getDonationById,
  deleteDonation,
  processDonationRefund,
} = require('../controllers/donationController');

const { adminOnly } = require('../middleware/authMiddleware');

// Razorpay Order Creation & Verification (Public)
router.post('/create-order', createDonationOrder);
router.post('/verify-payment', verifyDonationPayment);

// List all donations (Admin Only)
router.get('/', adminOnly, getAllDonations);
router.get('/all', adminOnly, getAllDonations);

// Single donation operations & delete (Admin Only)
router.get('/:id', adminOnly, getDonationById);
router.delete('/:id', adminOnly, deleteDonation);
router.delete('/delete/:donationId', adminOnly, deleteDonation);

// Refund (Admin Only)
router.post('/:id/refund', adminOnly, processDonationRefund);
router.post('/refund/:id', adminOnly, processDonationRefund);

module.exports = router;
