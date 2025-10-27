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
  createRazorpayOrder,
  verifyRazorpayPayment,
  fetchPaidUru,
  uploadCertificate,
  downloadCertificate,
  fetchAppliedUruByUser,
  updatePublishStatus,
  fetchPublishedUru,
  fetchPublishedUruById,
  downloadApplicationForm,
  sendPaymentReminder,
  givePaidApprove,   // ✅ import new controller
} = require("../Controllers/uruController");

const authenticate = require("../Middleware/authMiddleware");
const upload = require("../Middleware/multer");

// ✅ Create URU
router.post(
  "/create-uru",
  authenticate,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 10 },
  ]),
  createUru
);

// ✅ CRUD Operations
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

// ✅ Approval and Payment
router.put("/approve-uru/:id", approveUru);
router.get("/fetch-approved-uru", fetchApprovedUru);
router.put("/update-price", updatePrice);
router.put("/give-paid-approve/:id", givePaidApprove); // ✅ new route for manual payment approval

// ✅ Payment Handling
router.get("/get-uru-by-application-number/:applicationNumber", getUruByApplicationNumber);
router.post("/create-razorpay-order", authenticate, createRazorpayOrder);
router.post("/verify-razorpay-payment", authenticate, verifyRazorpayPayment);
router.get("/fetch-paid-uru", fetchPaidUru);

// ✅ Certificate
router.post(
  "/upload-certificate/:applicationNumber",
  upload.single("certificate"),
  uploadCertificate
);
router.get("/download-certificate/:applicationNumber", downloadCertificate);

// ✅ User-specific
router.get("/fetch-applied-uru-by-user", authenticate, fetchAppliedUruByUser);

// ✅ Publish Controls
router.put("/publish-uru/:id", updatePublishStatus);
router.get("/fetch-published-uru", fetchPublishedUru);
router.get("/fetch-published-uru/:id", fetchPublishedUruById);

// ✅ Application Form Download
router.get(
  "/download-application-form/:applicationNumber",
  authenticate,
  downloadApplicationForm
);

// ✅ Payment Reminder
router.post("/send-reminders", sendPaymentReminder);

module.exports = router;
