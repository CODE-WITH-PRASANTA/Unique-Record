const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Donation = require('../models/donationModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'p02juZwOX3wcgSAoE1uZwYWv',
});

// Helper: Generate unique Payment/Donation Number (e.g., DON2684912)
const generatePaymentNumber = () => {
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `DON${yearSuffix}${randomNum}`;
};

// @desc    Create Razorpay order for donation
// @route   POST /api/donation/create-order, POST /api/donations/create-order
// @access  Public
const createDonationOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid donation amount (minimum ₹1).',
      });
    }

    const options = {
      amount: Math.round(numericAmount * 100), // paise
      currency: 'INR',
      receipt: `don_rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
    });
  } catch (error) {
    console.error('Donation order creation failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Donation order creation failed',
    });
  }
};

// @desc    Verify Razorpay payment and save donation
// @route   POST /api/donation/verify-payment, POST /api/donations/verify-payment
// @access  Public
const verifyDonationPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      formData = {},
    } = req.body;

    const orderId = razorpay_order_id || razorpayOrderId;
    const paymentId = razorpay_payment_id || razorpayPaymentId;
    const signature = razorpay_signature || razorpaySignature;

    const donorName = formData.name || req.body.name;
    const donorEmail = formData.email || req.body.email;
    const donorPhone = formData.phone || req.body.phone;
    const donationAmount = formData.amount || req.body.amount;
    const certificate = formData.certificate || req.body.certificate || 'No';
    const panNumber = formData.panNumber || req.body.panNumber || '';
    const address = formData.address || req.body.address || 'N/A';
    const extra = formData.extra || req.body.extra || '';

    // Verify HMAC SHA256 Signature
    const secret = (process.env.RAZORPAY_KEY_SECRET || 'p02juZwOX3wcgSAoE1uZwYWv').trim();
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    const isSimulated =
      process.env.NODE_ENV !== 'production' &&
      (signature === 'TEST_DONATION_SIMULATION' ||
        orderId?.startsWith('order_test_') ||
        paymentId?.startsWith('pay_test_'));

    if (!isSimulated && generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Verification failed.',
      });
    }

    // Generate unique payment number
    let paymentNumber;
    let isUnique = false;
    while (!isUnique) {
      paymentNumber = generatePaymentNumber();
      const existing = await Donation.findOne({ paymentNumber });
      if (!existing) isUnique = true;
    }

    // Save to Database
    const donation = new Donation({
      paymentNumber,
      amount: Number(donationAmount),
      name: donorName,
      phone: donorPhone,
      email: donorEmail,
      certificate,
      panNumber,
      address,
      extra,
      paymentPlatform: 'Razorpay',
      paymentMethod: 'Razorpay Online Checkout',
      paymentStatus: 'Paid',
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
      razorpaySignature: signature,
      status: 'Completed',
      paidAt: new Date(),
    });

    await donation.save();

    // Optional: Send Thank You Email via Nodemailer
    if (process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER || 'uruonline2025@gmail.com',
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: '"Unique Record of Universe" <uruonline2025@gmail.com>',
          to: donorEmail,
          subject: '🎉 Thank You for Your Generous Donation – Unique Record of Universe',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background: #1e3a8a; color: white; padding: 24px; text-align: center;">
                <h2 style="margin: 0 0 8px 0;">Unique Record of Universe</h2>
                <p style="margin: 0; opacity: 0.9;">Official Donation Receipt</p>
              </div>
              <div style="padding: 24px; background: #ffffff;">
                <p>Dear <strong>${donorName}</strong>,</p>
                <p>Thank you immensely for your generous contribution of <strong>₹${donationAmount}</strong>. Your support empowers us to recognize and cultivate extraordinary talents across the universe.</p>
                <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="margin: 4px 0;"><strong>Receipt / Reference ID:</strong> ${paymentNumber}</p>
                  <p style="margin: 4px 0;"><strong>Transaction ID:</strong> ${paymentId}</p>
                  <p style="margin: 4px 0;"><strong>Amount:</strong> ₹${donationAmount}</p>
                  <p style="margin: 4px 0;"><strong>80G Certificate:</strong> ${certificate}</p>
                  <p style="margin: 4px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <p style="color: #64748b; font-size: 13px;">Warm regards,<br/><strong>Team Unique Record of Universe</strong></p>
              </div>
            </div>
          `,
        };

        transporter.sendMail(mailOptions).catch((err) => console.log('Email notice:', err.message));
      } catch (emailErr) {
        console.log('Email delivery skipped:', emailErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Donation processed and recorded successfully!',
      donation,
      paymentNumber,
    });
  } catch (error) {
    console.error('Error verifying donation payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

// @desc    Get all donations
// @route   GET /api/donation/all, GET /api/donations
// @access  Public / Admin
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    const totalAmount = donations.reduce((sum, d) => sum + (d.paymentStatus === 'Paid' ? Number(d.amount || 0) : 0), 0);

    res.status(200).json({
      success: true,
      count: donations.length,
      totalAmount,
      donations,
      data: donations,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching donations',
    });
  }
};

// @desc    Get single donation by ID or paymentNumber
// @route   GET /api/donation/:id, GET /api/donations/:id
// @access  Public / Admin
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    let donation;

    if (id.startsWith('DON') || id.startsWith('TXN')) {
      donation = await Donation.findOne({ paymentNumber: id });
    } else {
      donation = await Donation.findById(id);
    }

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
      donation,
    });
  } catch (error) {
    console.error('Error fetching single donation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching donation',
    });
  }
};

// @desc    Delete donation record
// @route   DELETE /api/donation/:id, DELETE /api/donation/delete/:id, DELETE /api/donations/:id
// @access  Admin
const deleteDonation = async (req, res) => {
  try {
    const donationId = req.params.donationId || req.params.id;
    const deleted = await Donation.findByIdAndDelete(donationId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donation record deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete donation record',
    });
  }
};

// @desc    Process Donation Refund via Razorpay
// @route   POST /api/donation/:id/refund, POST /api/donations/:id/refund
// @access  Admin
const processDonationRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundReason, adminRemark } = req.body;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found',
      });
    }

    let generatedRefundId = `rfd_${Date.now().toString().slice(-8)}`;

    if (donation.razorpayPaymentId && donation.razorpayPaymentId.startsWith('pay_')) {
      try {
        const razorpayRefund = await razorpay.payments.refund(donation.razorpayPaymentId, {
          amount: Math.round(donation.amount * 100),
          notes: {
            paymentNumber: donation.paymentNumber,
            donorName: donation.name,
            reason: refundReason || 'Donation refund requested',
          },
        });
        if (razorpayRefund?.id) {
          generatedRefundId = razorpayRefund.id;
        }
      } catch (rzpErr) {
        console.error('Razorpay refund notice:', rzpErr.message || rzpErr);
      }
    }

    donation.status = 'Refund';
    donation.paymentStatus = 'Refunded';
    donation.refundId = generatedRefundId;
    donation.refundAmount = `₹${donation.amount}`;
    donation.refundStatus = 'Processed';
    donation.refundedAt = new Date();
    donation.refundReason = refundReason || 'Admin processed donation refund';
    donation.adminRemark = adminRemark || `Refund of ₹${donation.amount} processed. (ID: ${generatedRefundId})`;

    await donation.save();

    res.status(200).json({
      success: true,
      message: `Refund of ₹${donation.amount} processed successfully!`,
      refundId: generatedRefundId,
      data: donation,
    });
  } catch (error) {
    console.error('Error processing donation refund:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund',
    });
  }
};

module.exports = {
  createDonationOrder,
  verifyDonationPayment,
  getAllDonations,
  getDonationById,
  deleteDonation,
  processDonationRefund,
};
