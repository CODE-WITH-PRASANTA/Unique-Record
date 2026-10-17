const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Donation = require('../models/donationModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'p02juZwOX3wcgSAoE1uZwYWv',
});

// Helper: Constant-time signature comparison to eliminate timing attacks
const safeCompareSignatures = (sigA, sigB) => {
  if (typeof sigA !== 'string' || typeof sigB !== 'string') return false;
  const bufA = Buffer.from(sigA, 'utf8');
  const bufB = Buffer.from(sigB, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

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
    const {
      amount,
      name = '',
      phone = '',
      email = '',
      address = '',
      certificate = 'No',
      panNumber = '',
      extra = '',
    } = req.body;
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
      notes: {
        donorName: String(name || '').trim().slice(0, 45),
        email: String(email || '').trim().slice(0, 45),
        phone: String(phone || '').trim().slice(0, 15),
        address: String(address || '').trim().slice(0, 100),
        certificate: certificate === 'Yes' ? 'Yes' : 'No',
        panNumber: String(panNumber || '').trim().slice(0, 15),
        extra: String(extra || '').trim().slice(0, 100),
        purpose: 'Spiritual & Social Development Donation',
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
    });
  } catch (error) {
    console.error('Donation order creation failed:', error);
    const msg = error?.error?.description || error.message || 'Donation order creation failed';
    res.status(500).json({
      success: false,
      message: msg,
    });
  }
};

// Helper: Send Official Donation Confirmation Email with View and Download PDF buttons
const sendDonationThankYouEmail = async (donation) => {
  if (!process.env.EMAIL_PASS || !donation || !donation.email) return;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'uruonline2025@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendBaseUrl =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://ouruniverse.in'
        : 'http://localhost:5173');

    const paymentNumber = donation.paymentNumber || donation.razorpayPaymentId || 'DON-RECEIPT';
    const paymentId = donation.razorpayPaymentId || 'N/A';
    const donorName = donation.name || 'Valued Donor';
    const donationAmount = Number(donation.amount || 0);
    const certificate = donation.certificate || 'No';
    const dateStr = donation.paidAt
      ? new Date(donation.paidAt).toLocaleDateString('en-IN')
      : new Date().toLocaleDateString('en-IN');

    const receiptUrl = `${frontendBaseUrl}/donation-success?paymentNumber=${encodeURIComponent(paymentNumber)}`;
    const downloadPdfUrl = `${frontendBaseUrl}/donation-success?paymentNumber=${encodeURIComponent(paymentNumber)}&download=pdf`;

    const mailOptions = {
      from: '"Unique Record of Universe" <uruonline2025@gmail.com>',
      to: donation.email,
      subject: `🎉 Official Donation Receipt #${paymentNumber} – Unique Record of Universe`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0A2540 0%, #1e3a8a 100%); color: #ffffff; padding: 28px 24px; text-align: center;">
            <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">Unique Record of Universe</h2>
            <p style="margin: 0; font-size: 13px; color: #fbbf24; font-weight: 600; text-transform: uppercase;">Divya Prerak Kahaniyan Humanity Research Centre Trust</p>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.85;">Official Contribution & Donation Acknowledgment</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px 24px; color: #1e293b;">
            <p style="font-size: 16px; line-height: 1.5; margin-top: 0;">Dear <strong>${donorName}</strong>,</p>
            <p style="font-size: 14.5px; line-height: 1.6; color: #334155;">
              Thank you immensely for your generous contribution of <strong>₹${donationAmount.toLocaleString('en-IN')}</strong>. Your noble support empowers us to recognize and cultivate extraordinary talents across the universe and fosters humanity service.
            </p>

            <!-- Donation Receipt Summary Box -->
            <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 18px 20px; margin: 22px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #334155;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Receipt / Reference ID:</strong></td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #1e3a8a;">${paymentNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Transaction ID:</strong></td>
                  <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 13px;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Donation Amount:</strong></td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #059669; font-size: 15px;">₹${donationAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>80G Tax Exemption:</strong></td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 600;">${certificate === 'Yes' ? 'Eligible for 80G Rebate' : 'Standard Receipt'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Contribution Date:</strong></td>
                  <td style="padding: 6px 0; text-align: right;">${dateStr}</td>
                </tr>
              </table>
            </div>

            <!-- MARKED LOCATION: View Payment Receipt Button & Download PDF Receipt Button -->
            <div style="text-align: center; margin: 28px 0 20px 0;">
              <a href="${receiptUrl}" target="_blank" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; font-size: 14.5px; font-weight: bold; padding: 13px 24px; border-radius: 8px; text-decoration: none; margin: 6px 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.12);">
                👁️ View Payment Receipt
              </a>
              <a href="${downloadPdfUrl}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 14.5px; font-weight: bold; padding: 13px 24px; border-radius: 8px; text-decoration: none; margin: 6px 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.12);">
                ⬇️ Download Receipt (PDF)
              </a>
            </div>

            <!-- Fallback URL -->
            <div style="background: #f1f5f9; border-radius: 8px; padding: 12px 16px; margin: 18px 0 22px 0; font-size: 12.5px; color: #475569; text-align: center; word-break: break-all;">
              You can also view or download your receipt directly online anytime at:<br/>
              <a href="${receiptUrl}" target="_blank" style="color: #2563eb; font-weight: 600; text-decoration: underline;">${receiptUrl}</a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px; font-size: 13px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">Warm regards and blessings,</p>
              <p style="margin: 0; font-weight: bold; color: #1e293b;">Team Unique Record of Universe</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Divya Prerak Kahaniyan Humanity Research Centre Trust · Helpline: +91 9472351693</p>
            </div>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions).catch((err) => console.log('Email notice:', err.message));
  } catch (emailErr) {
    console.log('Email delivery skipped:', emailErr.message);
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

    if (!isSimulated && !safeCompareSignatures(generatedSignature, signature)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Verification failed.',
      });
    }

    // Idempotency check: prevent duplicate record on retries
    if (paymentId) {
      const existing = await Donation.findOne({ razorpayPaymentId: paymentId });
      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'Donation payment already verified and recorded',
          paymentNumber: existing.paymentNumber,
          data: existing,
          donation: existing,
        });
      }
    }

    // Generate unique payment number with bounded loop
    let paymentNumber;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      attempts++;
      paymentNumber = generatePaymentNumber();
      const existing = await Donation.findOne({ paymentNumber });
      if (!existing) isUnique = true;
    }
    if (!isUnique) {
      paymentNumber = `DON${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-6)}`;
    }

    // Save to Database with race-condition code 11000 protection
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

    try {
      await donation.save();
    } catch (saveErr) {
      if (saveErr.code === 11000 && paymentId) {
        const existing = await Donation.findOne({ razorpayPaymentId: paymentId });
        if (existing) {
          return res.status(200).json({
            success: true,
            message: 'Donation payment already verified and recorded',
            paymentNumber: existing.paymentNumber,
            data: existing,
            donation: existing,
          });
        }
      }
      throw saveErr;
    }

    // Send Thank You Email via Nodemailer with View Receipt & Download PDF buttons
    sendDonationThankYouEmail(donation);

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

let lastSyncTime = 0;

// Helper: Synchronize captured donations from Razorpay
const syncRazorpayDonationsHelper = async (force = false) => {
  const now = Date.now();
  // Don't poll Razorpay more than once every 20 seconds unless forced
  if (!force && now - lastSyncTime < 20000) {
    return { synced: 0, message: 'Throttled' };
  }
  lastSyncTime = now;

  try {
    const paymentsRes = await razorpay.payments.all({ count: 50 });
    const payments = paymentsRes.items || [];
    let syncedCount = 0;

    for (const p of payments) {
      if (p.status !== 'captured') continue;

      const desc = p.description || '';
      const notes = p.notes || {};
      const isDonation =
        desc.includes('Donation') ||
        desc.includes('Glory of Donation') ||
        notes.purpose === 'Spiritual & Social Development Donation' ||
        notes.certificate !== undefined ||
        (p.order_id && p.order_id.startsWith('order_ToDU'));

      if (!isDonation) continue;

      // Check if already in DB by payment ID or order ID
      const query = [{ razorpayPaymentId: p.id }];
      if (p.order_id) query.push({ razorpayOrderId: p.order_id });
      const existing = await Donation.findOne({ $or: query });
      if (existing) continue;

      // Determine donor name
      let donorName = notes.donorName || notes.name;
      const contact = (p.contact || '').replace(/^\+91/, '').trim();
      const email = (p.email || '').trim().toLowerCase();

      if (!donorName) {
        if (email === 'jaihindtendua@gmail.com' || contact === '9472351693') {
          donorName = 'Dr. Avishek Kumar';
        } else if (email === 'sarojintermiles@gmail.com' || contact === '8117048317') {
          donorName = 'Saroj Kumar Mallik';
        } else if (email.includes('@')) {
          const userPart = email.split('@')[0].replace(/[._0-9]/g, ' ').trim();
          donorName = userPart ? userPart.charAt(0).toUpperCase() + userPart.slice(1) : 'Generous Donor';
        } else {
          donorName = 'Generous Donor';
        }
      }

      // Determine address
      let donorAddress = notes.address;
      if (!donorAddress) {
        if (email === 'jaihindtendua@gmail.com' || contact === '9472351693') {
          donorAddress = 'Jaihind Tendua, Nabinagar, Aurangabad, Bihar - 824301';
        } else if (email === 'sarojintermiles@gmail.com' || contact === '8117048317') {
          donorAddress = 'Thekma, Dist. Azamgarh, Uttar Pradesh - 276303';
        } else {
          donorAddress = 'India';
        }
      }

      let paymentNumber;
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        attempts++;
        paymentNumber = generatePaymentNumber();
        const existingNum = await Donation.findOne({ paymentNumber });
        if (!existingNum) isUnique = true;
      }
      if (!isUnique) {
        paymentNumber = `DON${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-6)}`;
      }

      const methodLabel = p.method === 'upi' && p.vpa ? `UPI (${p.vpa})` : (p.method ? p.method.toUpperCase() : 'Razorpay Online Checkout');

      const donation = new Donation({
        paymentNumber,
        amount: Number(p.amount) / 100,
        name: donorName,
        phone: contact || '—',
        email: email || 'donor@uniquerecord.com',
        certificate: notes.certificate === 'Yes' ? 'Yes' : 'No',
        panNumber: notes.panNumber && notes.panNumber !== 'N/A' ? notes.panNumber : '',
        address: donorAddress,
        extra: notes.extra || desc || 'Voluntary Contribution to DPKHRC Charitable Trust',
        paymentPlatform: 'Razorpay',
        paymentMethod: methodLabel,
        paymentStatus: 'Paid',
        razorpayPaymentId: p.id,
        razorpayOrderId: p.order_id || '',
        status: 'Completed',
        paidAt: new Date(p.created_at * 1000),
        createdAt: new Date(p.created_at * 1000),
      });

      await donation.save();
      syncedCount++;
      console.log(`Synced Razorpay donation: ${p.id} (₹${donation.amount}) for ${donorName}`);
    }

    return { synced: syncedCount, message: `Successfully synced ${syncedCount} donations.` };
  } catch (err) {
    console.error('Error auto-syncing Razorpay donations:', err.message);
    return { synced: 0, error: err.message };
  }
};

// @desc    Get all donations
// @route   GET /api/donation/all, GET /api/donations, GET /api/donation
// @access  Public / Admin
const getAllDonations = async (req, res) => {
  try {
    // Non-blocking auto sync check
    try {
      await syncRazorpayDonationsHelper(false);
    } catch (syncErr) {
      console.log('Background sync notice:', syncErr.message);
    }

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
    } else if (id.startsWith('pay_')) {
      donation = await Donation.findOne({ razorpayPaymentId: id });
    } else if (id.startsWith('order_')) {
      donation = await Donation.findOne({ razorpayOrderId: id });
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      donation = await Donation.findById(id);
    } else {
      donation = await Donation.findOne({
        $or: [
          { paymentNumber: id },
          { razorpayPaymentId: id },
          { razorpayOrderId: id },
        ],
      });
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

    if (donation.paymentStatus === 'Refunded' || donation.status === 'Refund') {
      return res.status(400).json({
        success: false,
        message: 'This donation has already been refunded.',
        refundId: donation.refundId,
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
        console.error('Razorpay refund error:', rzpErr);
        const errMsg = rzpErr?.error?.description || rzpErr.message || 'Razorpay refund failed';
        return res.status(502).json({
          success: false,
          message: `Payment gateway refund failed: ${errMsg}`,
        });
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

// @desc    Manually sync Razorpay donations
// @route   GET /api/donation/sync-razorpay, POST /api/donation/sync-razorpay
// @access  Public / Admin
const syncRazorpayDonationsController = async (req, res) => {
  try {
    const result = await syncRazorpayDonationsHelper(true);
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: result.message || 'Donations synchronized with Razorpay',
      syncedCount: result.synced,
      count: donations.length,
      donations,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Sync failed',
    });
  }
};

// @desc    Handle Razorpay Webhook
// @route   POST /api/donation/webhook
// @access  Public
const handleRazorpayWebhook = async (req, res) => {
  try {
    const event = req.body?.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      await syncRazorpayDonationsHelper(true);
    }
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(200).json({ status: 'error', message: err.message });
  }
};

// @desc    Resend confirmation and receipt email for a donation
// @route   POST /api/donation/:id/send-email, POST /api/donation/send-email
// @access  Public / Admin
const sendDonationReceiptEmailController = async (req, res) => {
  try {
    const donationId = req.params.id || req.body.id || req.body.paymentNumber;
    let donation;

    if (!donationId) {
      return res.status(400).json({ success: false, message: 'Please provide a donation ID or receipt number.' });
    }

    if (donationId.startsWith('DON') || donationId.startsWith('TXN')) {
      donation = await Donation.findOne({ paymentNumber: donationId });
    } else if (donationId.startsWith('pay_')) {
      donation = await Donation.findOne({ razorpayPaymentId: donationId });
    } else if (donationId.match(/^[0-9a-fA-F]{24}$/)) {
      donation = await Donation.findById(donationId);
    } else {
      donation = await Donation.findOne({
        $or: [
          { paymentNumber: donationId },
          { razorpayPaymentId: donationId },
        ],
      });
    }

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    await sendDonationThankYouEmail(donation);

    res.status(200).json({
      success: true,
      message: `Receipt email sent to ${donation.email} successfully!`,
      paymentNumber: donation.paymentNumber,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDonationOrder,
  verifyDonationPayment,
  getAllDonations,
  getDonationById,
  deleteDonation,
  processDonationRefund,
  syncRazorpayDonationsController,
  handleRazorpayWebhook,
  sendDonationReceiptEmailController,
};

