const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment , getAllDonations , sendDonationEmail } = require("../Controllers/donationController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/all", getAllDonations); // 👈 new route to get all donation data

// 👉 Admin Trigger Mail Route
router.post("/send-mail/:donationId", sendDonationEmail);


module.exports = router;
