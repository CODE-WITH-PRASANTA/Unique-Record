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

// Razorpay Order Creation & Verification
router.post('/create-order', createDonationOrder);
router.post('/verify-payment', verifyDonationPayment);

// List all donations
router.get('/', getAllDonations);
router.get('/all', getAllDonations);

// Single donation operations & delete
router.get('/:id', getDonationById);
router.delete('/:id', deleteDonation);
router.delete('/delete/:donationId', deleteDonation);

// Refund
router.post('/:id/refund', processDonationRefund);
router.post('/refund/:id', processDonationRefund);

module.exports = router;
