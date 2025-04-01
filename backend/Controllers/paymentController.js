const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../Model/paymentModel"); // Import Payment Model
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log incoming data
    const { amount, currency, receipt, phone } = req.body;

    if (!amount || !currency || !receipt) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order);

    // Store order details
    const newPayment = new Payment({
      orderId: order.id,
      amount,
      currency,
      phone,
      status: "PENDING",
    });

    await newPayment.save();
    res.status(200).json({ success: true, order });

  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ success: false, message: "Order creation failed", error });
  }
};
// Verify payment signature and store in database
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, phone } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Update payment status in DB
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id, status: "SUCCESS" }
      );

      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "FAILED" }
      );

      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification error", error });
  }
};
