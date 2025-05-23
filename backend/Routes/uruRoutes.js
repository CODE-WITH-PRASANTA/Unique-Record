const express = require("express");
const router = express.Router();

const {
  createUru,
  getAllUru,
  getUruById,
  updateUru,
  deleteUru,
  approveUru,
  fetchApprovedUru,
  updatePrice,
  getUruByApplicationNumber,
  createRazorpayOrder ,
verifyRazorpayPayment,
fetchPaidUru,
uploadCertificate,
downloadCertificate,
fetchAppliedUruByUser
} = require("../Controllers/uruController");
const authenticate = require("../Middleware/authMiddleware");
const upload = require("../Middleware/multer");

router.post(
  "/create-uru",
  authenticate,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  createUru
);

router.get("/get-all-uru", getAllUru);
router.get("/get-uru-by-id/:id", authenticate, getUruById);
router.put("/update-uru/:id", updateUru);
router.delete("/delete-uru/:id", deleteUru);
router.put("/approve-uru/:id", approveUru);
router.get("/fetch-approved-uru", fetchApprovedUru);
router.put("/update-price", updatePrice);
router.get("/get-uru-by-application-number/:applicationNumber", getUruByApplicationNumber);
router.post('/create-razorpay-order', authenticate, createRazorpayOrder);
router.post('/verify-razorpay-payment', authenticate, verifyRazorpayPayment);
router.get("/fetch-paid-uru", fetchPaidUru);
router.post(
  "/upload-certificate/:applicationNumber",
  upload.single("certificate"),
  uploadCertificate
);
router.get("/download-certificate/:applicationNumber", authenticate,  downloadCertificate);
router.get("/fetch-applied-uru-by-user", authenticate, fetchAppliedUruByUser);


module.exports = router;
