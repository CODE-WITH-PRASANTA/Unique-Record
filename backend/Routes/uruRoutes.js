const express = require("express");
const router = express.Router();
const {
  createURU,
  getAllURUs,
  updateURU,
  updateURUStatus,
  updateURUPrice,
  deleteURU, 
  getAllApprovedURUs , 
  getApplicationStatus ,
  createOrder ,
  verifyPayment
} = require("../Controllers/uruController");
const authenticate = require("../Middleware/authMiddleware");
const upload = require("../Middleware/multer");

router.post(
  "/create-uru",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  authenticate,
  createURU
);

router.get("/get-all-urus", getAllURUs);

router.put("/update-uru/:id", updateURU);

router.put("/update-uru-status/:id", updateURUStatus);

router.delete("/delete-uru/:id", deleteURU);

router.get("/get-all-approved-urus", getAllApprovedURUs);

router.put("/update-uru-price/:id", updateURUPrice);


router.get("/application-status", authenticate, getApplicationStatus);
router.post("/create-order", authenticate, createOrder);
router.post("/verify-payment", authenticate, verifyPayment);

module.exports = router;