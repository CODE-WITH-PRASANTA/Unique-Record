const EventRegistration = require('../models/eventRegistrationModel');
const path = require('path');
const fs = require('fs');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'p02juZwOX3wcgSAoE1uZwYWv',
});

// Helper to generate unique Application Number with collision safety
const generateApplicationNumber = async () => {
  let isUnique = false;
  let appNumber = '';
  const currentYear = new Date().getFullYear().toString().slice(-2);
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 digit number
    appNumber = `EVT${currentYear}${randomDigits}`;
    const existing = await EventRegistration.findOne({ applicationNumber: appNumber });
    if (!existing) {
      isUnique = true;
    }
  }

  // Fallback with timestamp if high collision
  if (!isUnique) {
    const timestampSuffix = Date.now().toString().slice(-5);
    appNumber = `EVT${currentYear}${timestampSuffix}`;
  }

  return appNumber;
};

// @desc    Create Razorpay Order for Event Registration Fee
// @route   POST /api/event-registrations/create-order
// @access  Public / Authenticated User
const createEventRazorpayOrder = async (req, res) => {
  try {
    const { amount, eventName, applicantName } = req.body;

    const numericAmount = parseFloat(String(amount || '0').replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration amount for payment',
      });
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const receiptId = `evtrcpt_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        eventName: (eventName || '').slice(0, 40),
        applicantName: (applicantName || '').slice(0, 40),
        type: 'Event Registration',
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
    });
  } catch (error) {
    console.error('Error creating Razorpay order for event:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment gateway',
    });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/event-registrations/verify-payment
// @access  Public / Authenticated User
const verifyEventPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment signature verification parameters',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'p02juZwOX3wcgSAoE1uZwYWv';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
    });
  } catch (error) {
    console.error('Error verifying event payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment',
    });
  }
};

// @desc    Register for an event (After Payment)
// @route   POST /api/event-registrations, POST /api/event-registrations/register
// @access  Public / Authenticated User
const registerForEvent = async (req, res) => {
  try {
    const {
      eventName,
      applicantName,
      sex,
      dateOfBirth,
      whatsappNumber,
      pinCode,
      district,
      state,
      email,
      website,
      educationalQualification,
      expertise,
      registrationFees,
      paymentStatus,
      paymentPlatform,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId,
    } = req.body;

    // Validate mandatory fields
    const missingFields = [];
    if (!eventName?.trim()) missingFields.push('Event Name');
    if (!applicantName?.trim()) missingFields.push('Applicant Name');
    if (!sex) missingFields.push('Gender');
    if (!dateOfBirth) missingFields.push('Date of Birth');
    if (!whatsappNumber?.trim()) missingFields.push('WhatsApp Mobile Number');
    if (!pinCode?.trim()) missingFields.push('Pin Code');
    if (!district?.trim()) missingFields.push('District');
    if (!state?.trim()) missingFields.push('State');
    if (!email?.trim()) missingFields.push('Email');
    if (!educationalQualification?.trim()) missingFields.push('Educational Qualification');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please provide all required fields: ${missingFields.join(', ')}`,
        missingFields,
      });
    }

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';

    let bioDataUrl = '';
    let photoUrl = '';

    if (req.files) {
      if (req.files.bioData && req.files.bioData[0]) {
        bioDataUrl = `${protocol}://${host}/upload/event-registrations/${req.files.bioData[0].filename}`;
      }
      if (req.files.photo && req.files.photo[0]) {
        photoUrl = `${protocol}://${host}/upload/event-registrations/${req.files.photo[0].filename}`;
      }
    }

    // Fallback if base64 or strings were passed
    if (!bioDataUrl && req.body.bioData && typeof req.body.bioData === 'string') {
      bioDataUrl = req.body.bioData;
    }
    if (!photoUrl && req.body.photo && typeof req.body.photo === 'string') {
      photoUrl = req.body.photo;
    }

    const applicationNumber = await generateApplicationNumber();

    const registration = await EventRegistration.create({
      applicationNumber,
      eventName: eventName.trim(),
      applicantName: applicantName.trim(),
      sex,
      dateOfBirth,
      whatsappNumber: whatsappNumber.trim(),
      pinCode: pinCode.trim(),
      district: district.trim(),
      state: state.trim(),
      email: email.trim().toLowerCase(),
      website: (website || '').trim(),
      educationalQualification: educationalQualification.trim(),
      expertise: (expertise || '').trim(),
      bioData: bioDataUrl,
      photo: photoUrl,
      registrationFees: registrationFees || '₹0',
      paymentPlatform: paymentPlatform || 'Razorpay',
      paymentMethod: paymentMethod || 'Online / UPI / Card',
      paymentStatus: paymentStatus || (razorpayPaymentId ? 'Paid' : 'Pending'),
      paidAt: razorpayPaymentId ? new Date() : null,
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || '',
      razorpaySignature: razorpaySignature || '',
      status: 'Pending',
      userId: userId || req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Event registered successfully! 🎉',
      applicationNumber,
      data: registration,
      registration,
    });
  } catch (error) {
    console.error('Error creating event registration:', error);
    
    // Handle duplicate key error (race condition on applicationNumber)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An application ID collision occurred. Please retry your submission.',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error processing event registration',
    });
  }
};

// @desc    Process Refund via Razorpay API
// @route   POST /api/event-registrations/:id/refund, POST /api/event-registrations/refund/:id
// @access  Admin
const processEventRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundReason, adminRemark } = req.body;

    const registration = await EventRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    if (registration.status === 'Refund' && registration.refundStatus === 'Processed') {
      return res.status(400).json({
        success: false,
        message: 'This registration has already been refunded.',
        data: registration,
      });
    }

    let generatedRefundId = registration.refundId || `rfd_${Date.now().toString().slice(-8)}`;
    let refundAmount = registration.registrationFees || '₹0';
    const remarkText = adminRemark || refundReason || `Status updated to Refund.`;

    registration.status = 'Refund';
    registration.paymentStatus = 'Refunded';
    registration.refundId = generatedRefundId;
    registration.refundAmount = refundAmount;
    registration.refundStatus = 'Processed';
    registration.refundedAt = new Date();
    registration.refundReason = refundReason || 'Admin updated status to Refund';
    registration.adminRemark = remarkText;

    await registration.save();

    res.status(200).json({
      success: true,
      message: `Status updated to Refund successfully!`,
      refundId: generatedRefundId,
      data: registration,
    });
  } catch (error) {
    console.error('Error updating event refund status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update status to refund',
    });
  }
};

// @desc    Track event registration status by Application Number
// @route   GET /api/event-registrations/track/:appNumber, GET /api/event-registrations/status/:appNumber
// @access  Public
const trackRegistrationStatus = async (req, res) => {
  try {
    const rawNumber = (req.params.appNumber || req.query.applicationNumber || req.query.appId || '').trim().toUpperCase();

    if (!rawNumber) {
      return res.status(400).json({
        success: false,
        message: 'Application number is required (e.g. EVT2610294)',
      });
    }

    const registration = await EventRegistration.findOne({
      $or: [
        { applicationNumber: rawNumber },
        { applicationNumber: { $regex: new RegExp(`^${rawNumber}$`, 'i') } },
      ],
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `No application found with ID "${rawNumber}". Please verify your number.`,
      });
    }

    // Determine status step and friendly message
    let step = 1;
    let statusCode = 'pending';
    let message = 'Your application has been received and is waiting for initial review.';

    switch (registration.status) {
      case 'Pending':
        step = 1;
        statusCode = 'pending';
        message = registration.adminRemark || 'Your application has been received and is waiting in the review queue.';
        break;
      case 'Under Process':
        step = 2;
        statusCode = 'verifying';
        message = registration.adminRemark || 'Your event registration is currently being verified by the organizing committee.';
        break;
      case 'Approved':
        step = 3;
        statusCode = 'approved';
        message = registration.adminRemark || 'Congratulations! Your event registration has been approved.';
        break;
      case 'Refund':
        step = -1;
        statusCode = 'refund';
        message = registration.adminRemark || `Registration fee ${registration.refundAmount || registration.registrationFees} has been refunded to your original payment method (Refund ID: ${registration.refundId || 'N/A'}).`;
        break;
      default:
        step = 1;
        statusCode = 'pending';
        message = 'Application received.';
    }

    res.status(200).json({
      success: true,
      data: {
        id: registration.applicationNumber,
        applicationNumber: registration.applicationNumber,
        applicantName: registration.applicantName,
        eventName: registration.eventName,
        sex: registration.sex,
        dateOfBirth: registration.dateOfBirth,
        status: registration.status,
        statusCode,
        step,
        message,
        registrationDate: registration.createdAt,
        registrationFees: registration.registrationFees,
        paymentPlatform: registration.paymentPlatform || 'Razorpay',
        paymentMethod: registration.paymentMethod || 'Online / UPI / Card',
        paymentStatus: registration.paymentStatus || 'Paid',
        paidAt: registration.paidAt || registration.createdAt,
        razorpayPaymentId: registration.razorpayPaymentId || '',
        razorpayOrderId: registration.razorpayOrderId || '',
        refundId: registration.refundId || '',
        refundAmount: registration.refundAmount || '',
        refundStatus: registration.refundStatus || 'None',
        refundedAt: registration.refundedAt || null,
        refundReason: registration.refundReason || '',
        whatsappNumber: registration.whatsappNumber,
        email: registration.email,
        district: registration.district,
        state: registration.state,
        pinCode: registration.pinCode,
        educationalQualification: registration.educationalQualification,
        expertise: registration.expertise,
        photo: registration.photo,
        bioData: registration.bioData,
        adminRemark: registration.adminRemark,
        _id: registration._id,
      },
    });
  } catch (error) {
    console.error('Error tracking event registration:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error tracking application status',
    });
  }
};

// @desc    Get all event registrations (with search & filter)
// @route   GET /api/event-registrations
// @access  Admin
const getAllEventRegistrations = async (req, res) => {
  try {
    const { search, status, eventName } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    if (eventName && eventName !== 'All') {
      query.eventName = { $regex: new RegExp(`^${eventName}$`, 'i') };
    }

    if (search) {
      const sanitized = search.trim();
      query.$or = [
        { applicationNumber: { $regex: sanitized, $options: 'i' } },
        { applicantName: { $regex: sanitized, $options: 'i' } },
        { eventName: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } },
        { whatsappNumber: { $regex: sanitized, $options: 'i' } },
        { district: { $regex: sanitized, $options: 'i' } },
        { state: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const registrations = await EventRegistration.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
      registrations,
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching event registrations',
    });
  }
};

// @desc    Get single event registration by ID
// @route   GET /api/event-registrations/:id
// @access  Admin
const getEventRegistrationById = async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    console.error('Error fetching event registration:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching registration' });
  }
};

// @desc    Update registration status
// @route   PATCH /api/event-registrations/:id/status, PUT /api/event-registrations/:id
// @access  Admin
const updateEventRegistrationStatus = async (req, res) => {
  try {
    const { status, adminRemark, paymentStatus } = req.body;
    const validStatuses = ['Pending', 'Under Process', 'Approved', 'Refund'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminRemark !== undefined) updateFields.adminRemark = adminRemark;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (status === 'Refund') {
      updateFields.paymentStatus = 'Refunded';
      updateFields.refundStatus = 'Processed';
      updateFields.refundedAt = new Date();
    }

    const registration = await EventRegistration.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to "${registration.status}" successfully!`,
      data: registration,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating status' });
  }
};

// @desc    Delete event registration
// @route   DELETE /api/event-registrations/:id
// @access  Admin
const deleteEventRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    // Optional: delete associated files from disk safely
    try {
      if (registration.photo && registration.photo.includes('/upload/event-registrations/')) {
        const photoFilename = registration.photo.split('/upload/event-registrations/')[1];
        const photoPath = path.join(__dirname, '..', 'upload', 'event-registrations', photoFilename);
        if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
      }
      if (registration.bioData && registration.bioData.includes('/upload/event-registrations/')) {
        const bioFilename = registration.bioData.split('/upload/event-registrations/')[1];
        const bioPath = path.join(__dirname, '..', 'upload', 'event-registrations', bioFilename);
        if (fs.existsSync(bioPath)) fs.unlinkSync(bioPath);
      }
    } catch (cleanupErr) {
      console.warn('File cleanup notice:', cleanupErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Event registration record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event registration:', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting registration' });
  }
};

module.exports = {
  createEventRazorpayOrder,
  verifyEventPayment,
  registerForEvent,
  processEventRefund,
  trackRegistrationStatus,
  getAllEventRegistrations,
  getEventRegistrationById,
  updateEventRegistrationStatus,
  deleteEventRegistration,
};
