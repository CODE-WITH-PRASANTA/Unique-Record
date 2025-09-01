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
  fetchAppliedUruByUser ,
  updatePublishStatus,
  fetchPublishedUru,
  fetchPublishedUruById,
  downloadApplicationForm,
} = require("../Controllers/uruController");
const authenticate = require("../Middleware/authMiddleware");
const upload = require("../Middleware/multer");


router.post(
  "/create-uru",
  authenticate,
  upload.fields([
    { name: "photos", maxCount: 10 },     // multiple photos
    { name: "videos", maxCount: 5 },      // multiple videos
    { name: "documents", maxCount: 10 }   // multiple documents (PDFs, etc.)
  ]),
  createUru
);

router.get("/get-all-uru", getAllUru);
router.get("/get-uru-by-id/:id", authenticate, getUruById);
router.put(
  "/update-uru/:id",
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 10 },
  ]),
  updateUru
);
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
router.get("/download-certificate/:applicationNumber",  downloadCertificate);
router.get("/fetch-applied-uru-by-user", authenticate, fetchAppliedUruByUser);
router.put("/publish-uru/:id", updatePublishStatus);
router.get("/fetch-published-uru", fetchPublishedUru);
router.get("/fetch-published-uru/:id", fetchPublishedUruById);


router.get(
  "/download-application-form/:applicationNumber",
  authenticate,
  downloadApplicationForm
);


module.exports = router;
