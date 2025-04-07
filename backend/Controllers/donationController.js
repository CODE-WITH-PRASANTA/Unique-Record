const Razorpay = require("razorpay");
const crypto = require("crypto");
const Donation = require("../Model/Donation");
const sendEmail = require("../Utils/email");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount) * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    formData,
  } = req.body;

  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const donation = new Donation({
        ...formData,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
      });

      await donation.save();
      res.status(200).json({ success: true, message: "Payment verified and donation saved" });
    } catch (err) {
      console.error("DB Save Error:", err);
      res.status(500).json({ success: false, message: "DB Error", error: err });
    }
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch donations" });
  }
};


const sendDonationEmail = async (req, res) => {
  const { donationId } = req.params;

  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    const emailContent = `
Dear ${donation.name},

Thank you so much for your generous donation of ₹${donation.amount}.
Your support means the world to us and helps us move closer to our mission.

--- DONATION DETAILS ---
🧾 Name: ${donation.name}
📞 Phone: ${donation.phone}
📧 Email: ${donation.email}
🏠 Address: ${donation.address}
📄 Certificate: ${donation.certificate}
💳 Payment ID: ${donation.paymentId}
📅 Date: ${new Date(donation.createdAt).toLocaleString()}

If you need any further assistance, feel free to contact us.

Warm regards,  
Team Unique Records of Universe
    `;

    await sendEmail(donation.email, "Thank You for Your Donation!", emailContent);

    res.status(200).json({ success: true, message: "Donation email sent successfully" });
  } catch (error) {
    console.error("Email Sending Error:", error);
    res.status(500).json({ success: false, message: "Failed to send donation email" });
  }
};


module.exports = {
  createOrder,
  verifyPayment,
  getAllDonations,
  sendDonationEmail,
};
