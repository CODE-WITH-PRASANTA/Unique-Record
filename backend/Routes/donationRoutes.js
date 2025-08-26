const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment , getAllDonations  , deleteDonation} = require("../Controllers/donationController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/all", getAllDonations); 


// DELETE donation route
router.delete("/delete/:donationId", deleteDonation);


module.exports = router;
