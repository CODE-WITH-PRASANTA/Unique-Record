const URU = require("../Model/uruModel");
const cloudinary = require("../Config/cloudinary");
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();
const { createHmac } = require('crypto');
const nodemailer = require("nodemailer");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uruonline2025@gmail.com", // official URU email
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const generateRegNo = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let regNo = "";
  for (let i = 0; i < 10; i++) {
    regNo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return regNo.toUpperCase(); // Optional: make it uppercase
};


module.exports = {
  createUru: async (req, res) => {
  try {
    const {
      position,
      applicantName,
      sex,
      dateOfBirth,
      address,
      district,
      country,
      state,
      pinCode,
      educationalQualification,
      whatsappMobileNumber,
      emailId,
      occupation,
      formCategory,
      recordCategory,
      recordTitle,
      recordDescription,
      purposeOfRecordAttempt,
      dateOfAttempt,
      recordVenue,
      organisationName,
      googleDriveLink,
      facebookLink,
      youtubeLink,
      instagramLink,
      linkedInLink,
      xLink,
      pinterestLink,
      otherMediaLink,
      witness1Name,
      witness1Designation,
      witness1Address,
      witness1MobileNumber,
      witness1EmailId,
      witness2Name,
      witness2Designation,
      witness2Address,
      witness2MobileNumber,
      witness2EmailId,
    } = req.body;

    const userId = req.user.id;

    const photo = req.files.photo;
    const video = req.files.video;
    const document = req.files.document;

    const photoResult = await cloudinary.uploader.upload(photo[0].path);
    const videoResult = video
      ? await cloudinary.uploader.upload(video[0].path, { resource_type: "video" })
      : null;
    const documentResult = document
      ? await cloudinary.uploader.upload(document[0].path)
      : null;

    let applicationNumber;
    let isUnique = false;

    while (!isUnique) {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      applicationNumber = `URU${randomNumber}`;
      const existingUru = await URU.findOne({ applicationNumber });
      if (!existingUru) {
        isUnique = true;
      }
    }

    // Generate random regNo
    let regNo;
    let regNoUnique = false;
    while (!regNoUnique) {
      regNo = generateRegNo();
      const existingReg = await URU.findOne({ regNo });
      if (!existingReg) regNoUnique = true;
    }

    const uru = new URU({
      position,
      userId,
      applicationNumber,
      regNo, // save generated regNo
      applicantName,
      sex,
      dateOfBirth,
      address,
      district,
      country,
      state,
      pinCode,
      educationalQualification,
      whatsappMobileNumber,
      emailId,
      occupation,
      formCategory,
      recordCategory,
      recordTitle,
      recordDescription,
      purposeOfRecordAttempt,
      dateOfAttempt,
      recordVenue,
      organisationName,
      googleDriveLink,
      facebookLink,
      youtubeLink,
      instagramLink,
      linkedInLink,
      xLink,
      pinterestLink,
      otherMediaLink,
      photoUrl: photoResult.secure_url,
      videoUrl: videoResult ? videoResult.secure_url : null,
      documentUrl: documentResult ? documentResult.secure_url : null,
      witness1: {
        name: witness1Name,
        designation: witness1Designation,
        address: witness1Address,
        mobileNumber: witness1MobileNumber,
        emailId: witness1EmailId,
      },
      witness2: {
        name: witness2Name,
        designation: witness2Designation,
        address: witness2Address,
        mobileNumber: witness2MobileNumber,
        emailId: witness2EmailId,
      },
    });

    await uru.save();

        const mailOptions = {
          from: '"Unique Records of Universe Official Team" <uruonline2025@gmail.com>',
          to: emailId,
          subject: "✅ URU Records – Application Confirmation",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background-color: #f4f6f8;">
              <table align="center" cellpadding="0" cellspacing="0" width="600" 
                style="margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr style="background:linear-gradient(90deg, #2c3e50, #34495e);">
                  <td style="padding:20px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0; font-size:22px;">Unique Records of Universe</h1>
                    <p style="margin:0; font-size:14px; color:#ecf0f1;">Recognizing Achievements Worldwide</p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <h2 style="color:#2c3e50; margin-bottom:10px;">Dear ${applicantName},</h2>
                    <p style="font-size:15px; line-height:1.6;">
                      Thank you for submitting your application to <b>URU Records</b>.  
                      We are excited to inform you that your application has been successfully received and is currently under review by our assessment team.  
                    </p>

                    <div style="background:#f9f9f9; border-left:4px solid #e67e22; padding:15px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0; font-size:15px;">
                        <b>📌 Application Number:</b> <span style="color:#e67e22; font-weight:bold;">${applicationNumber}</span>
                      </p>
                    </div>

                    <p style="font-size:15px; line-height:1.6;">
                      Our team will carefully verify your submission, documents, and any other supporting materials provided.  
                      Once the review is complete, you will be notified about the next steps.  
                    </p>

                    <p style="font-size:15px; line-height:1.6;">
                      We appreciate your interest in being part of the <b>URU Records</b> family, where achievements are celebrated and recognized on a global stage.  
                    </p>

                    <p style="font-size:15px; line-height:1.6; margin-bottom:30px;">
                      If you have any questions or require further assistance, feel free to contact us anytime.
                    </p>

                    <!-- Call to Action -->
                    <div style="text-align:center; margin:20px 0;">
                      <a href="mailto:uruonline2025@gmail.com" 
                        style="background:#2c3e50; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:4px; font-size:14px;">
                        📧 Contact Support
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr style="background:#ecf0f1;">
                  <td style="padding:15px; text-align:center; font-size:12px; color:#7f8c8d;">
                    <p style="margin:5px 0;">© ${new Date().getFullYear()} URU Records. All Rights Reserved.</p>
                    <p style="margin:5px 0;">
                      URU Records Official • <a href="mailto:uruonline2025@gmail.com" style="color:#2c3e50; text-decoration:none;">uruonline2025@gmail.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          `,
        };


    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "URU application created successfully & confirmation email sent",
      applicationNumber: uru.applicationNumber,
      regNo: uru.regNo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  },

  getAllUru: async (req, res) => {
    try {
      const urus = await URU.find().populate("userId", "name email");
      res.status(200).json(urus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUruById: async (req, res) => {
    try {
      const uru = await URU.findById(req.params.id).populate("userId", "name email");
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }
      res.status(200).json(uru);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUru: async (req, res) => {
    try {
      const uru = await URU.findById(req.params.id);
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }
      const updatedUru = await URU.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(updatedUru);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUru: async (req, res) => {
  try {
    const uru = await URU.findById(req.params.id);
    if (!uru) {
      return res.status(404).json({ message: "URU application not found" });
    }

    // Delete files from Cloudinary
    if (uru.photoUrl) {
      const photoPublicId = uru.photoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(photoPublicId);
    }

    if (uru.videoUrl) {
      const videoPublicId = uru.videoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(videoPublicId, { resource_type: 'video' });
    }

    if (uru.documentUrl) {
      const documentPublicId = uru.documentUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(documentPublicId);
    }

    if (uru.certificateUrl) {
      const certificatePublicId = uru.certificateUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(certificatePublicId);
    }

    // Delete the URU application from the database
    await URU.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "URU application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} ,

 approveUru: async (req, res) => {
  try {
    const uru = await URU.findById(req.params.id);
    if (!uru) {
      return res.status(404).json({ message: "URU application not found" });
    }
    uru.status = "Approved";
    uru.approvedDate = new Date();
    await uru.save({ validateBeforeSave: false });
    res.status(200).json({ message: "URU application approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  },

  fetchApprovedUru: async (req, res) => {
    try {
      const approvedUrus = await URU.find({ status: "Approved" });
      if (!approvedUrus.length) {
        return res.status(200).json([]); // Return empty array if no approved URUs
      }
      res.status(200).json(approvedUrus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePrice: async (req, res) => {
    try {
      const { applicationNumber, price } = req.body;
      if (!applicationNumber || !price) {
        return res.status(400).json({ message: "Application number and price are required" });
      }

      const uru = await URU.findOne({ applicationNumber });
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      if (uru.priceUpdated) {
        return res.status(400).json({ message: "Price has already been updated for this application" });
      }

      const updatedUru = await URU.findOneAndUpdate(
        { applicationNumber },
        {
          $set: {
            price,
            priceUpdated: true,
            priceUpdatedDate: new Date().toISOString(),
          },
        },
        { new: true }
      );

      res.status(200).json({ message: "Price updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUruByApplicationNumber: async (req, res) => {  
  try {
    const applicationNumber = req.params.applicationNumber;
    const uru = await URU.findOne({ applicationNumber });
    if (!uru) {
      return res.status(404).json({ message: "URU application not found" });
    }
    res.status(200).json(uru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  },

  createRazorpayOrder: async (req, res) => {
      try {
        const { applicationNumber } = req.body;

        const uru = await URU.findOne({ applicationNumber });
        if (!uru || !uru.price)
          return res.status(404).json({ message: "Application not found or price missing" });

        const options = {
          amount: uru.price * 100, // ₹ to paise
          currency: "INR",
          receipt: `receipt_${applicationNumber}`,
        };

        const order = await razorpay.orders.create(options);

        uru.razorpayOrderId = order.id;
        await uru.save();

        res.status(200).json({ orderId: order.id, amount: options.amount });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  },

  verifyRazorpayPayment: async (req, res) => {
    try {
      const { applicationNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      const hmac = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }

      // ✅ Update DB
      const uru = await URU.findOneAndUpdate(
        { applicationNumber },
        {
          paymentStatus: "Success",
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: "Approved",
        },
        { new: true }
      );

      // ✅ Setup transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "uruonline2025@gmail.com", // Official email
          pass: process.env.EMAIL_PASS, // Use App Password (not your Gmail password)
        },
      });

     const mailOptions = {
  from: '"Unique Records of Universe Official Team" <uruonline2025@gmail.com>',
  to: uru.emailId, // applicant email saved in DB
  subject: "🎉 Payment Confirmation - URU Records",
  html: `
    <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width:650px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2c3e50,#34495e); padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">Unique Records of Universe</h1>
        <p style="color:#ecf0f1; font-size:14px; margin:5px 0 0;">Official Payment Confirmation</p>
      </div>

      <!-- Body -->
      <div style="padding:25px; color:#333; line-height:1.6;">
        <h2 style="color:#27ae60; margin-bottom:12px;">🎉 Payment Successful!</h2>
        <p style="font-size:16px;">Dear <b>${uru.applicantName}</b>,</p>
        <p style="font-size:15px; color:#444;">
          We are delighted to confirm that your payment for the <b>URU Records Application</b> has been 
          <span style="color:#27ae60; font-weight:600;">successfully processed</span>.
        </p>

        <!-- Transaction Details -->
        <div style="background:#f9fafb; border:1px solid #e1e8ed; border-radius:8px; padding:15px; margin:20px 0;">
          <h3 style="margin:0 0 10px; font-size:16px; color:#2c3e50;">Transaction Details</h3>
          <ul style="list-style:none; padding:0; margin:0; font-size:14px;">
            <li style="padding:6px 0;"><b>Application Number:</b> ${applicationNumber}</li>
            <li style="padding:6px 0;"><b>Payment ID:</b> ${razorpayPaymentId}</li>
            <li style="padding:6px 0;"><b>Order ID:</b> ${razorpayOrderId}</li>
            <li style="padding:6px 0;"><b>Amount Paid:</b> ₹${(uru.price).toLocaleString("en-IN")}</li>
            <li style="padding:6px 0;"><b>Status:</b> <span style="color:#27ae60; font-weight:600;">Success</span></li>
          </ul>
        </div>

        <p style="font-size:15px; margin-top:15px;">
          Your application has been marked as <b style="color:#2980b9;">Approved</b>. 
          Our <b>Records Verification Team</b> will now carefully review your submission. 
          You will be notified about the next steps shortly.
        </p>

        <!-- Call to Action -->
        <div style="text-align:center; margin:25px 0;">
          <a href="mailto:uruonline2025@gmail.com" style="background:#27ae60; color:#fff; padding:12px 22px; border-radius:6px; text-decoration:none; font-size:15px; font-weight:600; display:inline-block; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
            📩 Contact URU Support
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f4f6f9; padding:15px; text-align:center; font-size:13px; color:#777;">
        <p style="margin:5px 0;">📌 For any queries, reach us at 
          <a href="mailto:uruonline2025@gmail.com" style="color:#2980b9;">uruonline2025@gmail.com</a>
        </p>
        <p style="margin:5px 0; color:#aaa;">© ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</p>
      </div>
    </div>
  `,
      };
      // ✅ Send Mail
      await transporter.sendMail(mailOptions);

      res.status(200).json({ success: true, message: "Payment verified and confirmation mail sent" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  fetchPaidUru: async (req, res) => {
    try {
      const paidUrus = await URU.find({ paymentStatus: "Success" });
      res.status(200).json(paidUrus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  uploadCertificate: async (req, res) => {
    try {
      const applicationNumber = req.params.applicationNumber;
      const uru = await URU.findOne({ applicationNumber });
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const certificate = req.file;
      const result = await cloudinary.uploader.upload(certificate.path);
      uru.certificateUrl = result.secure_url;
      await uru.save();

      res.status(200).json({ message: "Certificate uploaded successfully" });
    } catch (error) {
      console.error(error); // Log the error for more insights
      res.status(500).json({ message: error.message });
    }
  },

  downloadCertificate: async (req, res) => {
    try {
      const applicationNumber = req.params.applicationNumber;
      const uru = await URU.findOne({ applicationNumber });
      if (!uru || !uru.certificateUrl) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      const certificateUrl = uru.certificateUrl;
      res.redirect(certificateUrl);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  fetchAppliedUruByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const urus = await URU.find({ userId });
      res.status(200).json(urus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updatePublishStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      const uru = await URU.findById(id);
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      uru.isPublished = isPublished;
      await uru.save();

      res.status(200).json({
        message: `URU has been ${isPublished ? "Published" : "Unpublished"} successfully`,
        data: uru,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  fetchPublishedUru: async (req, res) => {
    try {
      const urus = await URU.find({ isPublished: true });
      res.status(200).json(urus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  fetchPublishedUruById: async (req, res) => {
    try {
      const { id } = req.params;

      const uru = await URU.findOne({ _id: id, isPublished: true });
      if (!uru) {
        return res.status(404).json({ message: "Published URU not found" });
      }

      res.status(200).json(uru);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
};
