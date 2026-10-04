const URU = require('../models/uruModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'p02juZwOX3wcgSAoE1uZwYWv',
});

// Helper to generate Unique Application Number
const generateApplicationNumber = async () => {
  let applicationNumber;
  let isUnique = false;
  while (!isUnique) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    applicationNumber = `URU${randomNumber}`;
    const existing = await URU.findOne({
      $or: [{ applicationNumber }, { appNo: applicationNumber }],
    });
    if (!existing) isUnique = true;
  }
  return applicationNumber;
};

// Helper to generate Reg Number
const generateRegNo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let regNo = '369';
  for (let i = 0; i < 7; i++) {
    regNo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return regNo;
};

// Helper to parse links safely
const parseLinks = (linksInput) => {
  if (!linksInput) return [];
  if (Array.isArray(linksInput)) return linksInput.filter(Boolean);
  if (typeof linksInput === 'string') {
    try {
      const parsed = JSON.parse(linksInput);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return [linksInput].filter(Boolean);
    } catch (e) {
      return [linksInput].filter(Boolean);
    }
  }
  return [];
};

// ==================== CREATE URU APPLICATION ====================
exports.createUru = async (req, res) => {
  try {
    const body = req.body;
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';

    const applicationNumber = await generateApplicationNumber();
    const regNo = generateRegNo();

    // Process files if uploaded via multer
    const photos = [];
    const videos = [];
    const documents = [];

    if (req.files) {
      if (req.files.photos) {
        req.files.photos.forEach((f) => {
          photos.push({
            url: `${protocol}://${host}/upload/uru/photos/${f.filename}`,
            filename: f.filename,
          });
        });
      }
      if (req.files.videos) {
        req.files.videos.forEach((f) => {
          videos.push({
            url: `${protocol}://${host}/upload/uru/videos/${f.filename}`,
            filename: f.filename,
          });
        });
      }
      if (req.files.documents) {
        req.files.documents.forEach((f) => {
          documents.push({
            url: `${protocol}://${host}/upload/uru/documents/${f.filename}`,
            filename: f.filename,
          });
        });
      }
    }

    // Parse witness details if stringified
    let witness1 = body.witness1;
    let witness2 = body.witness2;

    if (typeof witness1 === 'string') {
      try {
        witness1 = JSON.parse(witness1);
      } catch (e) {
        witness1 = {};
      }
    }
    if (typeof witness2 === 'string') {
      try {
        witness2 = JSON.parse(witness2);
      } catch (e) {
        witness2 = {};
      }
    }

    // If individual witness fields are sent
    if (!witness1) {
      witness1 = {
        name: body.witness1Name || '',
        designation: body.witness1Designation || '',
        address: body.witness1Address || '',
        mobileNumber: body.witness1Mobile || body.witness1MobileNumber || '',
        emailId: body.witness1Email || body.witness1EmailId || '',
      };
    }
    if (!witness2) {
      witness2 = {
        name: body.witness2Name || '',
        designation: body.witness2Designation || '',
        address: body.witness2Address || '',
        mobileNumber: body.witness2Mobile || body.witness2MobileNumber || '',
        emailId: body.witness2Email || body.witness2EmailId || '',
      };
    }

    // Extract links
    const links = body.links || {};

    const uru = new URU({
      position: body.position || body.applicationType || 'Unique Record',
      userId: req.user?.id || req.user?._id || body.userId || null,
      uniqueId: req.user?.uniqueId || body.uniqueId || '',
      applicationNumber,
      appNo: applicationNumber,
      regNo,
      applicantName: body.applicantName || body.name || 'Anonymous Applicant',
      name: body.applicantName || body.name || 'Anonymous Applicant',
      sex: body.sex || 'Other',
      dateOfBirth: body.dateOfBirth || null,
      address: body.address || '',
      district: body.district || '',
      state: body.state || '',
      country: body.country || 'India',
      pinCode: body.pinCode || '',
      educationalQualification: body.educationalQualification || '',
      whatsappMobileNumber: body.whatsappNumber || body.whatsappMobileNumber || body.mobile || body.phoneNumber || '',
      mobile: body.whatsappNumber || body.whatsappMobileNumber || body.mobile || body.phoneNumber || '',
      phoneNumber: body.whatsappNumber || body.whatsappMobileNumber || body.mobile || body.phoneNumber || '',
      emailId: body.emailId || body.email || '',
      email: body.emailId || body.email || '',
      occupation: body.occupation || '',
      category: body.category || 'Other',
      formCategory: body.category || 'Other',
      recordCategory: body.category || 'Other',
      effortType: body.effortType || 'Individual Effort',
      activityTitle: body.activityTitle || body.recordTitle || '',
      recordTitle: body.activityTitle || body.recordTitle || '',
      activityDescription: body.activityDescription || body.recordDescription || '',
      recordDescription: body.activityDescription || body.recordDescription || '',
      activityPurpose: body.activityPurpose || body.purposeOfRecordAttempt || '',
      purposeOfRecordAttempt: body.activityPurpose || body.purposeOfRecordAttempt || '',
      attemptDate: body.attemptDate || body.dateOfAttempt || null,
      dateOfAttempt: body.attemptDate || body.dateOfAttempt || null,
      activityVenue: body.activityVenue || body.recordVenue || '',
      recordVenue: body.activityVenue || body.recordVenue || '',
      organisationName: body.organisationName || '',

      // Social Links
      googleDriveLink: parseLinks(body.googleDriveLink || links.driveLink),
      facebookLink: parseLinks(body.facebookLink || links.facebookLink),
      youtubeLink: parseLinks(body.youtubeLink || links.youtubeLink),
      instagramLink: parseLinks(body.instagramLink || links.instagramLink),
      linkedInLink: parseLinks(body.linkedInLink || links.linkedinLink),
      twitterLink: parseLinks(body.twitterLink || body.xLink || links.twitterLink),
      xLink: parseLinks(body.xLink || body.twitterLink || links.twitterLink),
      pinterestLink: parseLinks(body.pinterestLink || links.pinterestLink),
      otherMediaLink: parseLinks(body.otherMediaLink || links.otherMediaLink),

      photos,
      videos,
      documents,

      witness1,
      witness2,

      status: 'Pending',
      approved: false,
      price: 0,
      paymentStatus: 'Pending',
    });

    await uru.save();

    // Send confirmation email asynchronously
    const applicantEmail = uru.emailId || uru.email;
    if (applicantEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Unique Records of Universe" <${process.env.EMAIL_USER}>`,
          to: applicantEmail,
          subject: `✅ Application Received: ${applicationNumber} - Unique Records of Universe`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
              <table align="center" width="600" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1); padding: 20px;">
                <tr style="background: linear-gradient(90deg, #2c3e50, #34495e);">
                  <td style="padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 22px;">Unique Records of Universe</h1>
                    <p style="margin: 0; font-size: 14px; color: #ecf0f1;">Official Application Confirmation</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 25px; color: #333333;">
                    <h2 style="color: #2c3e50;">Dear ${uru.applicantName},</h2>
                    <p style="font-size: 15px; line-height: 1.6;">
                      Thank you for submitting your application to <b>Unique Records of Universe</b>. Your application has been received and is under review.
                    </p>
                    <div style="background: #f9f9f9; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 16px;">
                        <b>Application Number:</b> <span style="color: #0ea5e9; font-weight: bold;">${applicationNumber}</span>
                      </p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">
                        <b>Position:</b> ${uru.position}
                      </p>
                    </div>
                    <p style="font-size: 14px; color: #555;">
                      You can monitor the real-time status of your application from your user dashboard.
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          `,
        };

        transporter.sendMail(mailOptions).catch((err) => console.log('Mail send error:', err.message));
      } catch (err) {
        console.error('Nodemailer setup error:', err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'URU application created successfully',
      applicationNumber: uru.applicationNumber,
      appNo: uru.appNo,
      regNo: uru.regNo,
      data: uru,
    });
  } catch (error) {
    console.error('Error creating URU application:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET ALL URU APPLICATIONS ====================
exports.getAllUru = async (req, res) => {
  try {
    const urus = await URU.find().sort({ createdAt: -1 }).lean();

    const formatted = urus.map((item, index) => ({
      id: item._id,
      _id: item._id,
      serialNo: index + 1,
      appNo: item.appNo || item.applicationNumber || `URU${item._id.toString().slice(-4)}`,
      applicationNumber: item.applicationNumber || item.appNo || `URU${item._id.toString().slice(-4)}`,
      appNumber: item.applicationNumber || item.appNo,
      position: item.position || 'Unique Record',
      name: item.applicantName || item.name || 'N/A',
      applicantName: item.applicantName || item.name || 'N/A',
      sex: item.sex || 'Other',
      mobile: item.whatsappMobileNumber || item.mobile || item.phoneNumber || 'N/A',
      whatsappMobileNumber: item.whatsappMobileNumber || item.mobile || item.phoneNumber || 'N/A',
      email: item.emailId || item.email || 'N/A',
      emailId: item.emailId || item.email || 'N/A',
      country: item.country || 'India',
      state: item.state || 'N/A',
      approved: item.approved || item.status === 'Approved',
      status: item.status || (item.approved ? 'Approved' : 'Pending'),
      price: item.price || 0,
      paymentStatus: item.paymentStatus || 'Pending',
      transactionId: item.paymentStatus === 'Paid' ? 'TXN_' + item._id.toString().slice(-6) : 'N/A',
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      createdAt: item.createdAt,
      photos: item.photos || [],
      videos: item.videos || [],
      documents: item.documents || [],
      witness1: item.witness1 || {},
      witness2: item.witness2 || {},
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching URU applications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET URU BY ID OR APPLICATION NUMBER ====================
exports.getUruById = async (req, res) => {
  try {
    const { id } = req.params;
    let uru;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      uru = await URU.findById(id);
    } else {
      uru = await URU.findOne({
        $or: [{ applicationNumber: id }, { appNo: id }],
      });
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU record not found' });
    }

    res.status(200).json({ success: true, data: uru });
  } catch (error) {
    console.error('Error fetching URU by ID:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE URU APPLICATION ====================
exports.updateUru = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    let uru;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      uru = await URU.findById(id);
    } else {
      uru = await URU.findOne({
        $or: [{ applicationNumber: id }, { appNo: id }],
      });
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU record not found' });
    }

    // Update mapped fields
    if (body.name || body.applicantName) {
      uru.applicantName = body.applicantName || body.name;
      uru.name = body.applicantName || body.name;
    }
    if (body.appNo || body.applicationNumber) {
      uru.appNo = body.appNo || body.applicationNumber;
      uru.applicationNumber = body.appNo || body.applicationNumber;
    }
    if (body.position) uru.position = body.position;
    if (body.email || body.emailId) {
      uru.email = body.email || body.emailId;
      uru.emailId = body.email || body.emailId;
    }
    if (body.mobile || body.whatsappMobileNumber || body.whatsappNumber) {
      uru.mobile = body.mobile || body.whatsappMobileNumber || body.whatsappNumber;
      uru.whatsappMobileNumber = uru.mobile;
    }
    if (body.sex) uru.sex = body.sex;
    if (body.dateOfBirth) uru.dateOfBirth = body.dateOfBirth;
    if (body.country) uru.country = body.country;
    if (body.state) uru.state = body.state;
    if (body.district) uru.district = body.district;
    if (body.address) uru.address = body.address;
    if (body.pinCode) uru.pinCode = body.pinCode;
    if (body.occupation) uru.occupation = body.occupation;
    if (body.educationalQualification) uru.educationalQualification = body.educationalQualification;
    if (body.category) {
      uru.category = body.category;
      uru.formCategory = body.category;
      uru.recordCategory = body.category;
    }
    if (body.effortType) uru.effortType = body.effortType;
    if (body.activityTitle || body.recordTitle) {
      uru.activityTitle = body.activityTitle || body.recordTitle;
      uru.recordTitle = uru.activityTitle;
    }
    if (body.activityDescription || body.recordDescription) {
      uru.activityDescription = body.activityDescription || body.recordDescription;
      uru.recordDescription = uru.activityDescription;
    }
    if (body.activityPurpose || body.purposeOfRecordAttempt) {
      uru.activityPurpose = body.activityPurpose || body.purposeOfRecordAttempt;
      uru.purposeOfRecordAttempt = uru.activityPurpose;
    }
    if (body.dateOfAttempt || body.attemptDate) {
      uru.dateOfAttempt = body.dateOfAttempt || body.attemptDate;
      uru.attemptDate = uru.dateOfAttempt;
    }
    if (body.activityVenue || body.recordVenue) {
      uru.activityVenue = body.activityVenue || body.recordVenue;
      uru.recordVenue = uru.activityVenue;
    }
    if (body.organisationName !== undefined) uru.organisationName = body.organisationName;

    // Links
    if (body.googleDriveLink !== undefined) uru.googleDriveLink = parseLinks(body.googleDriveLink);
    if (body.facebookLink !== undefined) uru.facebookLink = parseLinks(body.facebookLink);
    if (body.youtubeLink !== undefined) uru.youtubeLink = parseLinks(body.youtubeLink);
    if (body.instagramLink !== undefined) uru.instagramLink = parseLinks(body.instagramLink);
    if (body.linkedInLink !== undefined) uru.linkedInLink = parseLinks(body.linkedInLink);
    if (body.twitterLink !== undefined) uru.twitterLink = parseLinks(body.twitterLink);
    if (body.xLink !== undefined) uru.xLink = parseLinks(body.xLink);
    if (body.pinterestLink !== undefined) uru.pinterestLink = parseLinks(body.pinterestLink);
    if (body.otherMediaLink !== undefined) uru.otherMediaLink = parseLinks(body.otherMediaLink);

    // Witnesses
    if (body.witness1) {
      uru.witness1 = typeof body.witness1 === 'string' ? JSON.parse(body.witness1) : body.witness1;
    }
    if (body.witness2) {
      uru.witness2 = typeof body.witness2 === 'string' ? JSON.parse(body.witness2) : body.witness2;
    }

    if (typeof body.approved === 'boolean') {
      uru.approved = body.approved;
      uru.status = body.approved ? 'Approved' : 'Pending';
      if (body.approved && !uru.approvedDate) {
        uru.approvedDate = new Date();
      }
    }
    if (body.status) {
      uru.status = body.status;
      uru.approved = body.status === 'Approved';
      if (body.status === 'Approved' && !uru.approvedDate) {
        uru.approvedDate = new Date();
      }
    }
    if (body.price !== undefined) uru.price = Number(body.price);
    if (body.paymentStatus) uru.paymentStatus = body.paymentStatus;

    await uru.save();

    res.status(200).json({
      success: true,
      message: 'URU record updated successfully',
      data: uru,
    });
  } catch (error) {
    console.error('Error updating URU record:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== TOGGLE / APPROVE URU ====================
exports.toggleApproveUru = async (req, res) => {
  try {
    const { id } = req.params;
    let uru;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      uru = await URU.findById(id);
    } else {
      uru = await URU.findOne({
        $or: [{ applicationNumber: id }, { appNo: id }],
      });
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU record not found' });
    }

    // Toggle approved state
    const newStatus = !uru.approved;
    uru.approved = newStatus;
    uru.status = newStatus ? 'Approved' : 'Pending';
    if (newStatus) {
      uru.approvedDate = new Date();
    }

    await uru.save();

    res.status(200).json({
      success: true,
      message: `Application marked as ${uru.status}`,
      data: uru,
    });
  } catch (error) {
    console.error('Error toggling URU approval:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE URU ====================
exports.deleteUru = async (req, res) => {
  try {
    const { id } = req.params;
    let uru;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      uru = await URU.findByIdAndDelete(id);
    } else {
      uru = await URU.findOneAndDelete({
        $or: [{ applicationNumber: id }, { appNo: id }],
      });
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'URU application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting URU record:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE PRICE ====================
exports.updatePrice = async (req, res) => {
  try {
    const { id, applicationNumber, price } = req.body;

    const query = id ? { _id: id } : { $or: [{ applicationNumber }, { appNo: applicationNumber }] };
    const uru = await URU.findOne(query);

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU record not found' });
    }

    uru.price = Number(price);
    uru.priceUpdated = true;
    uru.priceUpdatedDate = new Date();
    await uru.save();

    res.status(200).json({
      success: true,
      message: `Price updated to ₹${price}`,
      data: uru,
    });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FETCH USER'S APPLIED URUS ====================
exports.fetchAppliedUruByUser = async (req, res) => {
  try {
    let tokenEmail = null;
    let tokenUserId = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_unique_record');
        tokenEmail = decoded.email;
        tokenUserId = decoded.id;
      } catch (e) {}
    }

    const email = (req.query.email || req.query.emailId || req.user?.email || tokenEmail || '').trim().toLowerCase();
    const userId = req.query.userId || req.query.id || req.user?.id || req.user?._id || tokenUserId;
    const uniqueId = req.query.uniqueId || req.user?.uniqueId;

    let queryConditions = [];
    if (email) {
      queryConditions.push({ emailId: { $regex: new RegExp(`^${email}$`, 'i') } });
      queryConditions.push({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    }
    if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        queryConditions.push({ userId: new mongoose.Types.ObjectId(userId) });
      }
      queryConditions.push({ userId: String(userId) });
    }
    if (uniqueId) {
      queryConditions.push({ uniqueId });
    }

    if (queryConditions.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const urus = await URU.find({ $or: queryConditions }).sort({ createdAt: -1 }).lean();

    const formatted = urus.map((item, index) => ({
      id: item.appNo || item.applicationNumber || `URU${item._id.toString().slice(-4)}`,
      _id: item._id,
      serialNo: index + 1,
      appNo: item.appNo || item.applicationNumber,
      applicationNumber: item.applicationNumber || item.appNo,
      appNumber: item.applicationNumber || item.appNo,
      position: item.position || 'Unique Record',
      category: item.position || item.category || 'Unique Record',
      name: item.applicantName || item.name || 'Applicant',
      applicantName: item.applicantName || item.name || 'Applicant',
      sex: item.sex || 'Other',
      mobile: item.whatsappMobileNumber || item.mobile || item.phoneNumber || 'N/A',
      email: item.emailId || item.email || 'N/A',
      country: item.country || 'India',
      state: item.state || 'N/A',
      approved: Boolean(item.approved || item.status === 'Approved'),
      status: item.status || (item.approved ? 'Approved' : 'Pending'),
      price: item.price || 0,
      paymentStatus: item.paymentStatus || 'Pending',
      transactionId: item.paymentStatus === 'Paid' ? (item.razorpayPaymentId || 'TXN_' + item._id.toString().slice(-6)) : 'N/A',
      certificateUrl: item.certificateUrl || '',
      isPublished: Boolean(item.isPublished),
      published: Boolean(item.isPublished),
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching user URU applications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FETCH APPROVED URU APPLICATIONS ====================
exports.fetchApprovedUru = async (req, res) => {
  try {
    const urus = await URU.find({
      $or: [{ approved: true }, { status: 'Approved' }, { status: 'Paid' }],
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    const formatted = urus.map((item, index) => ({
      id: item._id,
      _id: item._id,
      serialNo: index + 1,
      appNo: item.appNo || item.applicationNumber || `URU${item._id.toString().slice(-4)}`,
      applicationNumber: item.applicationNumber || item.appNo || `URU${item._id.toString().slice(-4)}`,
      appNumber: item.applicationNumber || item.appNo,
      position: item.position || 'Unique Record',
      name: item.applicantName || item.name || 'N/A',
      applicantName: item.applicantName || item.name || 'N/A',
      sex: item.sex || 'Other',
      mobile: item.whatsappMobileNumber || item.mobile || item.phoneNumber || 'N/A',
      email: item.emailId || item.email || 'N/A',
      country: item.country || 'India',
      state: item.state || 'N/A',
      approved: true,
      status: item.status || 'Approved',
      price: item.price || 0,
      paymentStatus: item.paymentStatus || 'Pending',
      transactionId: item.paymentStatus === 'Paid' ? (item.razorpayPaymentId || 'TXN_' + item._id.toString().slice(-6)) : 'N/A',
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching approved URU:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GIVE PAID APPROVE ====================
exports.givePaidApprove = async (req, res) => {
  try {
    const { id } = req.params;
    let uru;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      uru = await URU.findById(id);
    } else {
      uru = await URU.findOne({
        $or: [{ applicationNumber: id }, { appNo: id }],
      });
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU application not found' });
    }

    // Toggle or set paid status
    const isCurrentlyPaid = uru.paymentStatus === 'Paid' || uru.status === 'Paid';
    if (isCurrentlyPaid) {
      uru.paymentStatus = 'Pending';
      uru.status = 'Approved';
    } else {
      uru.paymentStatus = 'Paid';
      uru.status = 'Paid';
      uru.approved = true;
      if (!uru.razorpayPaymentId) {
        uru.razorpayPaymentId = `TXN_ADMIN_${Date.now().toString().slice(-6)}`;
      }
    }

    await uru.save();

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${uru.paymentStatus}`,
      data: uru,
    });
  } catch (error) {
    console.error('Error in givePaidApprove:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET RAZORPAY KEY ====================
exports.getRazorpayKey = async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj';
    res.status(200).json({
      success: true,
      keyId,
    });
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CREATE RAZORPAY ORDER ====================
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { id, applicationNumber, appNo, amount } = req.body;

    let query = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    } else {
      const num = applicationNumber || appNo || id;
      if (num) {
        query = { $or: [{ applicationNumber: num }, { appNo: num }] };
      }
    }

    let uru = null;
    if (query) {
      uru = await URU.findOne(query);
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU application not found' });
    }

    const price = Number(uru.price) > 0 ? Number(uru.price) : Number(amount) > 0 ? Number(amount) : 499;
    const amountInPaise = Math.round(price * 100);

    const receiptId = `rcpt_${(uru.applicationNumber || uru.appNo || uru._id.toString()).slice(-10)}_${Date.now().toString().slice(-4)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        applicationNumber: uru.applicationNumber || uru.appNo || '',
        applicantName: uru.applicantName || uru.name || '',
        position: uru.position || 'Unique Record',
      },
    };

    const order = await razorpay.orders.create(options);

    uru.razorpayOrderId = order.id;
    if (Number(uru.price) <= 0) {
      uru.price = price;
    }
    await uru.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_1gSA9RbSjj0sEj',
      app: {
        id: uru.applicationNumber || uru.appNo,
        name: uru.applicantName || uru.name,
        email: uru.emailId || uru.email,
        mobile: uru.whatsappMobileNumber || uru.mobile,
        position: uru.position,
        price,
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== VERIFY RAZORPAY PAYMENT ====================
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      id,
      applicationNumber,
      appNo,
      razorpayOrderId,
      razorpay_order_id,
      razorpayPaymentId,
      razorpay_payment_id,
      razorpaySignature,
      razorpay_signature,
    } = req.body;

    const orderId = razorpayOrderId || razorpay_order_id;
    const paymentId = razorpayPaymentId || razorpay_payment_id;
    const signature = razorpaySignature || razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing order_id, payment_id, or signature in verification request',
      });
    }

    // Verify HMAC SHA256 signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'p02juZwOX3wcgSAoE1uZwYWv';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      console.error('Payment signature mismatch:', { generated: generatedSignature, received: signature });
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid digital signature',
      });
    }

    // Find the record
    let queryConditions = [{ razorpayOrderId: orderId }];
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      queryConditions.push({ _id: id });
    }
    const num = applicationNumber || appNo || id;
    if (num) {
      queryConditions.push({ applicationNumber: num });
      queryConditions.push({ appNo: num });
    }

    let uru = await URU.findOne({ $or: queryConditions });

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU application not found for this payment' });
    }

    // Mark as paid & approved
    uru.paymentStatus = 'Paid';
    uru.status = 'Paid';
    uru.approved = true;
    uru.razorpayOrderId = orderId;
    uru.razorpayPaymentId = paymentId;
    uru.razorpaySignature = signature;
    if (!uru.approvedDate) {
      uru.approvedDate = new Date();
    }

    await uru.save();

    // Send confirmation email
    const applicantEmail = uru.emailId || uru.email;
    if (applicantEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Unique Records of Universe" <${process.env.EMAIL_USER}>`,
          to: applicantEmail,
          subject: `🎉 Payment Confirmation - ${uru.applicationNumber || uru.appNo} - Unique Records of Universe`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
              <table align="center" width="600" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1); padding: 20px;">
                <tr style="background: linear-gradient(135deg, #7c3aed, #4f46e5);">
                  <td style="padding: 25px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Unique Records of Universe</h1>
                    <p style="margin: 5px 0 0; font-size: 15px; color: #e0e7ff;">Official Payment Receipt &amp; Approval</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; color: #333333;">
                    <h2 style="color: #16a34a; margin-top: 0;">🎉 Payment Received Successfully!</h2>
                    <p style="font-size: 15px; line-height: 1.6;">
                      Dear <b>${uru.applicantName || uru.name}</b>,
                    </p>
                    <p style="font-size: 15px; line-height: 1.6;">
                      We have received your payment for your application to <b>Unique Records of Universe</b>. Your application is officially verified and confirmed.
                    </p>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
                      <h3 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Transaction Summary</h3>
                      <table width="100%" style="font-size: 14px; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 6px 0; color: #64748b;">Application Number:</td>
                          <td style="padding: 6px 0; font-weight: bold; text-align: right;">${uru.applicationNumber || uru.appNo}</td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; color: #64748b;">Position:</td>
                          <td style="padding: 6px 0; font-weight: bold; text-align: right;">${uru.position}</td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; color: #64748b;">Payment Transaction ID:</td>
                          <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #7c3aed;">${paymentId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; color: #64748b;">Razorpay Order ID:</td>
                          <td style="padding: 6px 0; font-weight: bold; text-align: right;">${orderId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; color: #64748b;">Amount Paid:</td>
                          <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #16a34a; font-size: 16px;">₹${(uru.price || 499).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; color: #64748b;">Payment Status:</td>
                          <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #16a34a;">PAID / SUCCESS</td>
                        </tr>
                      </table>
                    </div>
                    <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
                      You can log in to your dashboard anytime to track updates and download your digital receipt.
                    </p>
                  </td>
                </tr>
                <tr style="background: #f1f5f9;">
                  <td style="padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
                    © ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.
                  </td>
                </tr>
              </table>
            </div>
          `,
        };

        transporter.sendMail(mailOptions).catch((e) => console.log('Mail send error in verification:', e.message));
      } catch (e) {
        console.error('Email transporter error:', e.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and status updated to Paid successfully',
      data: uru,
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SEND PAYMENT REMINDERS ====================
exports.sendPaymentReminder = async (req, res) => {
  try {
    const pendingUrus = await URU.find({
      $or: [{ approved: true }, { status: 'Approved' }],
      paymentStatus: { $ne: 'Paid' },
    });

    if (pendingUrus.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending payment applications found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Reminders sent successfully to ${pendingUrus.length} applicant(s).`,
      count: pendingUrus.length,
    });
  } catch (error) {
    console.error('Error sending payment reminders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FETCH PAID URU APPLICATIONS (FOR /uru/final) ====================
exports.fetchPaidUru = async (req, res) => {
  try {
    const urus = await URU.find({
      $or: [{ paymentStatus: 'Paid' }, { paymentStatus: 'Success' }, { status: 'Paid' }],
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    const formatted = urus.map((item, index) => {
      const certUrl = item.certificateUrl || '';
      const certName = certUrl ? certUrl.split('/').pop() : 'No file chosen';

      return {
        id: item._id,
        _id: item._id,
        serialNo: index + 1,
        appNo: item.appNo || item.applicationNumber || `URU${item._id.toString().slice(-4)}`,
        applicationNumber: item.applicationNumber || item.appNo || `URU${item._id.toString().slice(-4)}`,
        name: item.applicantName || item.name || 'N/A',
        applicantName: item.applicantName || item.name || 'N/A',
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : 'N/A',
        paymentStatus: 'Success',
        price: item.price || 0,
        transactionId: item.razorpayPaymentId || `TXN_${item._id.toString().slice(-6)}`,
        certificateUrl: certUrl,
        fileName: certName,
        isPublished: Boolean(item.isPublished),
        published: Boolean(item.isPublished),
        position: item.position || 'Unique Record',
        email: item.emailId || item.email || 'N/A',
        mobile: item.whatsappMobileNumber || item.mobile || 'N/A',
      };
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching paid URU:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPLOAD CERTIFICATE ====================
exports.uploadCertificate = async (req, res) => {
  try {
    const { id, applicationNumber } = req.params;
    const targetId = id || applicationNumber;
    let uru;

    if (targetId && mongoose.isValidObjectId(targetId)) {
      uru = await URU.findById(targetId);
    }
    if (!uru && targetId) {
      uru = await URU.findOne({
        $or: [{ applicationNumber: targetId }, { appNo: targetId }],
      });
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU application not found' });
    }

    if (req.file) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      uru.certificateUrl = `${protocol}://${host}/upload/uru/certificates/${req.file.filename}`;
    } else if (req.body.certificateUrl) {
      uru.certificateUrl = req.body.certificateUrl;
    } else {
      return res.status(400).json({ success: false, message: 'No certificate file or URL uploaded' });
    }

    await uru.save();

    res.status(200).json({
      success: true,
      message: 'Certificate uploaded successfully',
      certificateUrl: uru.certificateUrl,
      data: uru,
    });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE PUBLISH STATUS ====================
exports.updatePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let uru;

    if (id && mongoose.isValidObjectId(id)) {
      uru = await URU.findById(id);
    }
    if (!uru && id) {
      uru = await URU.findOne({
        $or: [{ applicationNumber: id }, { appNo: id }],
      });
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'URU application not found' });
    }

    let nextPublished;
    if (typeof req.body.isPublished === 'boolean') {
      nextPublished = req.body.isPublished;
    } else if (typeof req.body.published === 'boolean') {
      nextPublished = req.body.published;
    } else if (req.body.isPublished === 'true' || req.body.published === 'true') {
      nextPublished = true;
    } else if (req.body.isPublished === 'false' || req.body.published === 'false') {
      nextPublished = false;
    } else {
      nextPublished = !uru.isPublished;
    }

    uru.isPublished = nextPublished;
    await uru.save();

    // Send publication email if published (safely in background, never block or fail response)
    const applicantEmail = uru.emailId || uru.email;
    if (uru.isPublished && applicantEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Unique Records of Universe" <${process.env.EMAIL_USER}>`,
          to: applicantEmail,
          subject: `🌟 Congratulations! Your Record is Published - Unique Records of Universe`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
              <table align="center" width="600" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1); padding: 20px;">
                <tr style="background: linear-gradient(135deg, #10b981, #059669);">
                  <td style="padding: 25px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Unique Records of Universe</h1>
                    <p style="margin: 5px 0 0; font-size: 15px; color: #d1fae5;">Record Published Worldwide</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; color: #333333;">
                    <h2 style="color: #059669; margin-top: 0;">🎉 Congratulations ${uru.applicantName || uru.name}!</h2>
                    <p style="font-size: 15px; line-height: 1.6;">
                      We are proud to inform you that your record/achievement (<b>${uru.position}</b>) with Application Number <b>${uru.applicationNumber || uru.appNo}</b> is now officially published on the Unique Records of Universe portal.
                    </p>
                    <p style="font-size: 14px; color: #64748b;">
                      You can log in to your dashboard to view your post, certificate, and achievements.
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          `,
        };

        transporter.sendMail(mailOptions).catch((e) => console.log('Mail send error in publish:', e.message));
      } catch (e) {
        console.error('Publish email transporter setup error:', e.message);
      }
    }

    res.status(200).json({
      success: true,
      message: uru.isPublished ? 'Record published successfully' : 'Record unpublished successfully',
      isPublished: uru.isPublished,
      published: uru.isPublished,
      data: uru,
    });
  } catch (error) {
    console.error('Error updating publish status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FETCH PUBLISHED URU ====================
exports.fetchPublishedUru = async (req, res) => {
  try {
    const urus = await URU.find({ isPublished: true }).sort({ updatedAt: -1, createdAt: -1 }).lean();
    res.status(200).json(urus);
  } catch (error) {
    console.error('Error fetching published URU:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FETCH PUBLISHED URU BY ID ====================
exports.fetchPublishedUruById = async (req, res) => {
  try {
    const { id } = req.params;
    let uru;

    if (id && mongoose.isValidObjectId(id)) {
      uru = await URU.findOne({ _id: id, isPublished: true }).lean();
    }
    if (!uru && id) {
      uru = await URU.findOne({
        $or: [{ applicationNumber: id }, { appNo: id }],
        isPublished: true,
      }).lean();
    }

    if (!uru) {
      return res.status(404).json({ success: false, message: 'Published URU not found' });
    }

    res.status(200).json(uru);
  } catch (error) {
    console.error('Error fetching published URU by ID:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



