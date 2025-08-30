const Razorpay = require("razorpay");
const crypto = require("crypto");
const Donation = require("../Model/Donation");
const sendEmail = require("../Utils/email");
const nodemailer = require("nodemailer");


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ------------------
// Generate unique Payment Number (TXN)
// ------------------
const generatePaymentNumber = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `TXN${timestamp}${randomNum}`;
};

// ------------------
// Create Razorpay order
// ------------------
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

  // Check Razorpay signature
  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      // Generate unique TXN number
      let paymentNumber;
      let exists = true;

      while (exists) {
        paymentNumber = generatePaymentNumber();
        const donationExists = await Donation.findOne({ paymentNumber });
        if (!donationExists) exists = false;
      }

      // Create donation in DB
      const donation = new Donation({
        ...formData,
        paymentNumber,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
      });

      await donation.save();

      // ------------------
      // Setup Nodemailer Transporter
      // ------------------
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "uruonline2025@gmail.com",
          pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password)
        },
      });

      // ------------------
      // Send Professional Email
      // ------------------
      const mailOptions = {
        from: '"Unique Records of Universe Team" <uruonline2025@gmail.com>',
        to: formData.email,
        subject: "🎉 Thank You for Your Donation – Unique Records of Universe",
        html: `
          <div style="font-family: Arial, sans-serif; background:#f9fafc; padding:0; margin:0;">
            <table align="center" cellpadding="0" cellspacing="0" width="600" 
              style="margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; 
              box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr style="background:linear-gradient(90deg, #1d2671, #c33764);">
                <td style="padding:20px; text-align:center; color:#ffffff;">
                  <h1 style="margin:0; font-size:22px;">Unique Records of Universe</h1>
                  <p style="margin:0; font-size:14px; color:#f1f1f1;">Celebrating Achievements, Inspiring the World</p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333;">
                  <h2 style="color:#1d2671; margin-bottom:10px;">Dear ${formData.name},</h2>
                  <p style="font-size:15px; line-height:1.6;">
                    On behalf of the <b>Unique Records of Universe</b>, we sincerely thank you for your generous donation.  
                    Your contribution will help us recognize and celebrate extraordinary achievements globally.  
                  </p>

                  <div style="background:#f9f9f9; border-left:4px solid #c33764; 
                      padding:15px; margin:20px 0; border-radius:4px;">
                    <p style="margin:0; font-size:15px;">
                      <b>✅ Donation Details:</b><br/>
                      <b>Payment Number:</b> ${paymentNumber}<br/>
                      <b>Amount:</b> ₹${formData.amount}<br/>
                      <b>Date:</b> ${new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <p style="font-size:15px; line-height:1.6;">
                    Your support means the world to us. We assure you that every contribution makes a meaningful impact.  
                  </p>

                  <p style="font-size:15px; line-height:1.6; margin-bottom:30px;">
                    If you have any questions or need assistance, feel free to reach out to our team anytime.  
                  </p>

                  <!-- CTA -->
                  <div style="text-align:center; margin:20px 0;">
                    <a href="mailto:uruonline2025@gmail.com" 
                      style="background:#1d2671; color:#ffffff; padding:12px 25px; 
                      text-decoration:none; border-radius:4px; font-size:14px; display:inline-block;">
                      📧 Contact Support
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr style="background:#f1f1f1;">
                <td style="padding:15px; text-align:center; font-size:12px; color:#555;">
                  <p style="margin:5px 0;">© ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</p>
                  <p style="margin:5px 0;">
                    Contact us: <a href="mailto:uruonline2025@gmail.com" 
                    style="color:#1d2671; text-decoration:none;">uruonline2025@gmail.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: "Payment verified, donation saved & confirmation email sent.",
        paymentNumber,
      });
    } catch (err) {
      console.error("DB Save / Email Error:", err);
      res.status(500).json({ success: false, message: "DB or Email Error", error: err });
    }
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};


// ------------------
// Get all donations
// ------------------
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch donations" });
  }
};

// ------------------
// Delete Donation
// ------------------
const deleteDonation = async (req, res) => {
  const { donationId } = req.params;

  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    await Donation.findByIdAndDelete(donationId);
    res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ success: false, message: "Failed to delete donation" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getAllDonations,
  deleteDonation,
};
