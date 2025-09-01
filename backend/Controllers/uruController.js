const URU = require("../Model/uruModel");
const cloudinary = require("../Config/cloudinary");
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();
const { createHmac } = require('crypto');
const nodemailer = require("nodemailer");
  const PDFDocument = require("pdfkit");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uruonline2025@gmail.com", // Admin URU email
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const generateRegNo = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Uppercase alphanumeric
  let regNo = "369"; // First three digits fixed

  for (let i = 0; i < 7; i++) { // Remaining 7 characters
    regNo += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return regNo;
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

      // ✅ multiple link fields
      googleDriveLink,
      facebookLink,
      youtubeLink,
      instagramLink,
      linkedInLink,
      xLink,
      pinterestLink,
      otherMediaLink,

      // ✅ witness
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

    // ================== Upload multiple files ===================
    let photoFiles = [];
    let videoFiles = [];
    let documentFiles = [];

    if (req.files && req.files.photos) {
      for (const file of req.files.photos) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "uru/photos",
        });
        photoFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    if (req.files && req.files.videos) {
      for (const file of req.files.videos) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "video",
          folder: "uru/videos",
        });
        videoFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    if (req.files && req.files.documents) {
      for (const file of req.files.documents) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "raw", // for pdf/doc files
          folder: "uru/documents",
        });
        documentFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // ================== Generate application number ===================
    let applicationNumber;
    let isUnique = false;
    while (!isUnique) {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      applicationNumber = `URU${randomNumber}`;
      const existingUru = await URU.findOne({ applicationNumber });
      if (!existingUru) isUnique = true;
    }

    // ================== Generate unique regNo ===================
    let regNo;
    let regNoUnique = false;
    while (!regNoUnique) {
      regNo = generateRegNo();
      const existingReg = await URU.findOne({ regNo });
      if (!existingReg) regNoUnique = true;
    }

    // ================== Save to DB ===================
    const uru = new URU({
      position,
      userId,
      applicationNumber,
      regNo,
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

      // ✅ social/media links (always arrays)
      googleDriveLink: Array.isArray(googleDriveLink) ? googleDriveLink : googleDriveLink ? [googleDriveLink] : [],
      facebookLink: Array.isArray(facebookLink) ? facebookLink : facebookLink ? [facebookLink] : [],
      youtubeLink: Array.isArray(youtubeLink) ? youtubeLink : youtubeLink ? [youtubeLink] : [],
      instagramLink: Array.isArray(instagramLink) ? instagramLink : instagramLink ? [instagramLink] : [],
      linkedInLink: Array.isArray(linkedInLink) ? linkedInLink : linkedInLink ? [linkedInLink] : [],
      xLink: Array.isArray(xLink) ? xLink : xLink ? [xLink] : [],
      pinterestLink: Array.isArray(pinterestLink) ? pinterestLink : pinterestLink ? [pinterestLink] : [],
      otherMediaLink: Array.isArray(otherMediaLink) ? otherMediaLink : otherMediaLink ? [otherMediaLink] : [],

      photos: photoFiles,
      videos: videoFiles,
      documents: documentFiles,

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
          from: '"Unique Records of Universe Admin Team" <uruonline2025@gmail.com>',
          to: emailId,
          subject: "✅ Unique Records of Universe Records – Application Confirmation",
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
                      Thank you for submitting your application to <b>Unique Records of Universe Records</b>.  
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
                      We appreciate your interest in being part of the <b>Unique Records of Universe</b> family, where achievements are celebrated and recognized on a global stage.  
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
                    <p style="margin:5px 0;">© ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</p>
                    <p style="margin:5px 0;">
                      Unique Records of Universe Admin • <a href="mailto:uruonline2025@gmail.com" style="color:#2c3e50; text-decoration:none;">uruonline2025@gmail.com</a>
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
    const urus = await URU.find()
      .populate("userId", "name email")
      .lean(); // use lean to return plain JS objects (faster, lighter)

    // Format response (optional: ensure empty arrays are returned if no files)
    const formattedUrus = urus.map(uru => ({
      ...uru,
      photos: uru.photos || [],
      videos: uru.videos || [],
      documents: uru.documents || [],
    }));

    res.status(200).json(formattedUrus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  },

  getUruById: async (req, res) => {
    try {
      const uru = await URU.findById(req.params.id)
        .populate("userId", "name email")
        .lean();

      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      // Ensure files are structured arrays
      const formattedUru = {
        ...uru,
        photos: uru.photos || [],
        videos: uru.videos || [],
        documents: uru.documents || [],
      };

      res.status(200).json(formattedUru);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  updateUru: async (req, res) => {
  try {
    let uru = await URU.findById(req.params.id);
    if (!uru) {
      return res.status(404).json({ message: "URU application not found" });
    }

    // ================= Parse removal arrays =================
    const { removedPhotos = "[]", removedVideos = "[]", removedDocuments = "[]" } = req.body;
    const removedPhotosArr = JSON.parse(removedPhotos);
    const removedVideosArr = JSON.parse(removedVideos);
    const removedDocumentsArr = JSON.parse(removedDocuments);

    // ================= Handle removals =================
    if (removedPhotosArr.length) {
      for (const p of removedPhotosArr) {
        if (p.public_id) await cloudinary.uploader.destroy(p.public_id);
      }
      uru.photos = uru.photos.filter((p) => !removedPhotosArr.find((rp) => rp.public_id === p.public_id));
    }

    if (removedVideosArr.length) {
      for (const v of removedVideosArr) {
        if (v.public_id) await cloudinary.uploader.destroy(v.public_id, { resource_type: "video" });
      }
      uru.videos = uru.videos.filter((v) => !removedVideosArr.find((rv) => rv.public_id === v.public_id));
    }

    if (removedDocumentsArr.length) {
      for (const d of removedDocumentsArr) {
        if (d.public_id) await cloudinary.uploader.destroy(d.public_id, { resource_type: "raw" });
      }
      uru.documents = uru.documents.filter((d) => !removedDocumentsArr.find((rd) => rd.public_id === d.public_id));
    }

    // ================= Handle new uploads =================
    if (req.files && req.files.photos) {
      for (const file of req.files.photos) {
        if (file.size > 10 * 1024 * 1024) {
          return res.status(400).json({ message: "Photo size must be ≤ 10MB" });
        }
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "uru/photos",
        });
        uru.photos.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    if (req.files && req.files.videos) {
      for (const file of req.files.videos) {
        if (file.size > 100 * 1024 * 1024) {
          return res.status(400).json({ message: "Video size must be ≤ 100MB" });
        }
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "video",
          folder: "uru/videos",
        });
        uru.videos.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    if (req.files && req.files.documents) {
      for (const file of req.files.documents) {
        if (file.size > 10 * 1024 * 1024) {
          return res.status(400).json({ message: "Document size must be ≤ 10MB" });
        }
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "raw",
          folder: "uru/documents",
        });
        uru.documents.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
        ["googleDriveLink", "facebookLink", "youtubeLink", "instagramLink", "linkedInLink", "xLink", "pinterestLink", "otherMediaLink"].forEach(field => {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          req.body[field] = [];
        }
      }
    });

      // ================= Update other fields =================
      let updateData = { ...req.body };

      // If witness1 and witness2 are strings, parse them
      if (req.body.witness1 && typeof req.body.witness1 === "string") {
        try {
          updateData.witness1 = JSON.parse(req.body.witness1);
        } catch (e) {
          console.error("Invalid witness1 JSON:", req.body.witness1);
          updateData.witness1 = {};
        }
      }

      if (req.body.witness2 && typeof req.body.witness2 === "string") {
        try {
          updateData.witness2 = JSON.parse(req.body.witness2);
        } catch (e) {
          console.error("Invalid witness2 JSON:", req.body.witness2);
          updateData.witness2 = {};
        }
      }

      Object.assign(uru, updateData);
      await uru.save();


    res.status(200).json({ message: "URU updated successfully", uru });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  },
  deleteUru: async (req, res) => {
    try {
      const uru = await URU.findById(req.params.id);
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      // Helper to delete from Cloudinary for images/videos/raw
      const deleteFromCloudinary = async (items, resourceType) => {
        if (!items || items.length === 0) return;

        for (const item of items) {
          try {
            let publicId;
            if (resourceType === "raw" && item.public_id) {
              publicId = item.public_id; // for documents stored as {url, public_id}
            } else if (typeof item === "string") {
              const parts = item.split('/');
              const fileName = parts.pop(); 
              publicId = fileName.split('.')[0];
            }
            if (publicId) {
              await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
            }
          } catch (err) {
            console.error(`Failed to delete ${resourceType}:`, err.message);
          }
        }
      };

      // Delete all media types
      await deleteFromCloudinary(uru.photos, 'image');
      await deleteFromCloudinary(uru.videos, 'video');
      await deleteFromCloudinary(uru.documents, 'raw');
      if (uru.certificateUrl) {
        await deleteFromCloudinary([uru.certificateUrl], 'image');
      }

      // Delete URU from DB
      await URU.findByIdAndDelete(req.params.id);

      // Send professional rejection email
      const emailId = uru.emailId; // applicant's email
      const applicantName = uru.name || "Applicant"; // applicant name
      const applicationNumber = uru.applicationNumber;

      const mailOptions = {
        from: '"Unique Records of Universe Admin Team" <uruonline2025@gmail.com>',
        to: emailId,
        subject: "❌ Unique Records of Universe – Application Status Update",
        html: `
          <div style="font-family: Arial, sans-serif; padding:0; margin:0; background-color:#f4f6f8;">
            <table align="center" cellpadding="0" cellspacing="0" width="600" 
              style="margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr style="background:linear-gradient(90deg, #c0392b, #e74c3c);">
                <td style="padding:20px; text-align:center; color:#ffffff;">
                  <h1 style="margin:0; font-size:22px;">Unique Records of Universe</h1>
                  <p style="margin:0; font-size:14px; color:#f9ebea;">Your Application Status Update</p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  <h2 style="color:#c0392b; margin-bottom:10px;">Dear ${applicantName},</h2>
                  <p style="font-size:15px; line-height:1.6;">
                    We regret to inform you that your application to <b>Unique Records of Universe</b> has been <b>rejected</b> and removed from our system. 
                  </p>

                  <div style="background:#f9f9f9; border-left:4px solid #e74c3c; padding:15px; margin:20px 0; border-radius:4px;">
                    <p style="margin:0; font-size:15px;">
                      <b>📌 Application No. Number:</b> <span style="color:#e74c3c; font-weight:bold;">${applicationNumber}</span>
                    </p>
                  </div>

                  <p style="font-size:15px; line-height:1.6;">
                    If you wish to understand the reason for this decision, please do not hesitate to contact our admin team. 
                  </p>

                  <!-- Call to Action -->
                  <div style="text-align:center; margin:20px 0;">
                    <a href="mailto:uruonline2025@gmail.com" 
                      style="background:#c0392b; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:4px; font-size:14px;">
                      📧 Contact Admin
                    </a>
                  </div>

                  <p style="font-size:15px; line-height:1.6;">
                    We appreciate your interest in being part of <b>Unique Records of Universe</b> and encourage you to apply again in the future.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr style="background:#ecf0f1;">
                <td style="padding:15px; text-align:center; font-size:12px; color:#7f8c8d;">
                  <p style="margin:5px 0;">© ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</p>
                  <p style="margin:5px 0;">
                    Unique Records of Universe Admin • <a href="mailto:uruonline2025@gmail.com" style="color:#2c3e50; text-decoration:none;">uruonline2025@gmail.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "URU application deleted and rejection email sent successfully" });

    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: error.message });
    }
  },
    
  approveUru: async (req, res) => {
    try {
      const uru = await URU.findById(req.params.id);
      if (!uru) {
        return res.status(404).json({ message: "URU application not found" });
      }

      // Update status to Approved
      uru.status = "Approved";
      uru.approvedDate = new Date();
      await uru.save({ validateBeforeSave: false });

      // Send professional approval email
      const emailId = uru.emailId; // applicant's email
      const applicantName = uru.name || "Applicant"; // applicant name
      const applicationNumber = uru.applicationNumber;

      const mailOptions = {
        from: '"Unique Records of Universe Admin Team" <uruonline2025@gmail.com>',
        to: emailId,
        subject: "✅ Unique Records of Universe – Application Approved",
        html: `
          <div style="font-family: Arial, sans-serif; padding:0; margin:0; background-color:#f4f6f8;">
            <table align="center" cellpadding="0" cellspacing="0" width="600" 
              style="margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr style="background:linear-gradient(90deg, #27ae60, #2ecc71);">
                <td style="padding:20px; text-align:center; color:#ffffff;">
                  <h1 style="margin:0; font-size:22px;">Unique Records of Universe</h1>
                  <p style="margin:0; font-size:14px; color:#ecf0f1;">Application Status Update</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  <h2 style="color:#27ae60; margin-bottom:10px;">Dear ${applicantName},</h2>
                  <p style="font-size:15px; line-height:1.6;">
                    Congratulations! Your application to <b>Unique Records of Universe</b> has been <b>approved</b> by our team.
                  </p>

                  <div style="background:#f9f9f9; border-left:4px solid #27ae60; padding:15px; margin:20px 0; border-radius:4px;">
                    <p style="margin:0; font-size:15px;">
                      <b>📌 Application Number:</b> <span style="color:#27ae60; font-weight:bold;">${applicationNumber}</span>
                    </p>
                  </div>

                  <p style="font-size:15px; line-height:1.6;">
                    Our team will update the pricing shortly. Please complete the payment to finalize your record. You can monitor the status and payment details on your dashboard.
                  </p>

                  <!-- Call to Action -->
                  <div style="text-align:center; margin:20px 0;">
                    <a href="https://ouruniverse.in/login" 
                      style="background:#27ae60; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:4px; font-size:14px;">
                      💳 Go to Dashboard
                    </a>
                  </div>

                  <p style="font-size:15px; line-height:1.6;">
                    We appreciate your contribution to <b>Unique Records of Universe</b> and look forward to celebrating your achievement.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr style="background:#ecf0f1;">
                <td style="padding:15px; text-align:center; font-size:12px; color:#7f8c8d;">
                  <p style="margin:5px 0;">© ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</p>
                  <p style="margin:5px 0;">
                    Unique Records of Universe Admin • <a href="mailto:uruonline2025@gmail.com" style="color:#2c3e50; text-decoration:none;">uruonline2025@gmail.com</a>
                  </p>
                </td>
              </tr>

            </table>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "URU application approved and approval email sent successfully" });

    } catch (error) {
      console.error("Approval error:", error);
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

      // Update price in database
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

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "uruonline2025@gmail.com", // Admin URU email
          pass: process.env.EMAIL_PASS, // Gmail App Password
        },
      });

      const mailOptions = {
  from: '"Unique Records of Universe Admin Team" <uruonline2025@gmail.com>',
  to: uru.emailId, 
  subject: "✅ URU Application – Price Updated",
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f0f2f5; padding:20px 0;">
      <table align="center" cellpadding="0" cellspacing="0" width="600" 
        style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <tr style="background: linear-gradient(90deg, #4e54c8, #8f94fb);">
          <td style="padding:25px; text-align:center; color:#fff;">
            <h1 style="margin:0; font-size:24px; font-weight:700;">Unique Records of Universe</h1>
            <p style="margin:5px 0 0 0; font-size:14px; color:#e0e0ff;">Recognizing Achievements Worldwide</p>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding:35px 30px; color:#333;">
            <h2 style="margin-top:0; color:#4e54c8; font-size:20px;">Hello ${uru.applicantName},</h2>
            <p style="font-size:16px; line-height:1.7; color:#555;">
              Your application has been successfully <strong>updated</strong>. We have set the price to <strong style="color:#27ae60;">₹${price}</strong>.
            </p>

            <table cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0; border-radius:8px; overflow:hidden; border:1px solid #ddd;">
              <tr style="background:#f7f8fa;">
                <td style="padding:15px; font-size:15px; font-weight:600; color:#444;">
                  📌 Application Number:
                </td>
                <td style="padding:15px; font-size:15px; font-weight:600; color:#e67e22;">
                  ${applicationNumber}
                </td>
              </tr>
              <tr>
                <td style="padding:15px; font-size:15px; font-weight:600; color:#444;">
                  💰 Updated Price:
                </td>
                <td style="padding:15px; font-size:15px; font-weight:600; color:#27ae60;">
                  ₹${price}
                </td>
              </tr>
            </table>

            <p style="font-size:16px; line-height:1.7; color:#555;">
              Our team will continue processing your application, and you will receive updates as the next steps are completed. Thank you for trusting <strong>Unique Records of Universe</strong>!
            </p>

           <!-- CTA Buttons -->
          <div style="text-align:center; margin:30px 0;">
            <!-- Contact Support Button -->
            <a href="mailto:uruonline2025@gmail.com" 
              style="display:inline-block; padding:12px 30px; background:linear-gradient(90deg, #4e54c8, #8f94fb); color:#fff; text-decoration:none; font-size:16px; font-weight:600; border-radius:8px; box-shadow:0 4px 15px rgba(78,84,200,0.3); margin-right:15px;">
              📧 Contact Support
            </a>

            <!-- Pay Now Button -->
            <a href="https://ouruniverse.in/login" target="_blank"
              style="display:inline-block; padding:12px 30px; background:linear-gradient(90deg, #ff416c, #ff4b2b); color:#fff; text-decoration:none; font-size:16px; font-weight:600; border-radius:8px; box-shadow:0 4px 15px rgba(255,65,108,0.3);">
              💳 Pay Now
            </a>
          </div>


            <p style="font-size:14px; color:#999; text-align:center; margin-top:40px;">
              You are receiving this email because you submitted an application to <strong>Unique Records of Universe</strong>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr style="background:#f7f8fa;">
          <td style="padding:20px; text-align:center; font-size:12px; color:#888;">
            © ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.<br>
            Admin • <a href="mailto:uruonline2025@gmail.com" style="color:#4e54c8; text-decoration:none;">uruonline2025@gmail.com</a>
          </td>
        </tr>
      </table>
    </div>
  `,
        };


      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: `Price updated successfully to ₹${price} and email sent.` });
    } catch (error) {
      console.error(error);
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
          user: "uruonline2025@gmail.com", // Admin email
          pass: process.env.EMAIL_PASS, // Use App Password (not your Gmail password)
        },
      });

     const mailOptions = {
      from: '"Unique Records of Universe Admin Team" <uruonline2025@gmail.com>',
      to: uru.emailId, // applicant email saved in DB
      subject: "🎉 Payment Confirmation - Unique Records of Universe",
      html: `
    <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width:650px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2c3e50,#34495e); padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">Unique Records of Universe</h1>
        <p style="color:#ecf0f1; font-size:14px; margin:5px 0 0;">Admin Payment Confirmation</p>
      </div>

      <!-- Body -->
      <div style="padding:25px; color:#333; line-height:1.6;">
        <h2 style="color:#27ae60; margin-bottom:12px;">🎉 Payment Successful!</h2>
        <p style="font-size:16px;">Dear <b>${uru.applicantName}</b>,</p>
       <p style="font-size:15px; color:#444; line-height:1.7;">
          We are happy to confirm that your <strong>application fee</strong> for entering your name in 
          <strong>'Unique Records of Universe'</strong> has been 
          <span style="color:#27ae60; font-weight:600;">successfully received</span>.
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
            <!-- Contact Button -->
            <a href="mailto:uruonline2025@gmail.com" 
              style="background:#27ae60; color:#fff; padding:12px 22px; border-radius:6px; 
                      text-decoration:none; font-size:15px; font-weight:600; display:inline-block; 
                      margin:0 8px; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
              📩 Contact URU Support
            </a>

            <!-- Login Button -->
            <a href="https://ouruniverse.in/login" 
              style="background:#2980b9; color:#fff; padding:12px 22px; border-radius:6px; 
                      text-decoration:none; font-size:15px; font-weight:600; display:inline-block; 
                      margin:0 8px; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
              🔑 Login
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

      // ✅ Setup transporter (use your Gmail credentials or SMTP)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // e.g., uruonline2025@gmail.com
          pass: process.env.EMAIL_PASS, // your app password (not Gmail password)
        },
      });

     const mailOptions = {
  from: '"Unique Records of Universe" <uruonline2025@gmail.com>',
  to: uru.emailId,
  subject: isPublished
    ? "✅ Your Record/Activity Has Been Published!"
    : "⚠️ Your Record/Activity Has Been Unpublished",
  html: `
  <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1abc9c,#16a085);padding:20px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">Unique Records of Universe</h1>
      <p style="color:#ecf0f1;margin:5px 0 0;font-size:14px;">Record Status Update</p>
    </div>

    <!-- Body -->
    <div style="padding:25px;color:#333;line-height:1.6;">
      <h2 style="color:${isPublished ? "#27ae60" : "#e74c3c"}; margin-bottom:12px; font-size:20px; font-weight:600;">
        ${isPublished 
          ? "🎉 Congratulations! Your unique record/activity is now published in its own universe." 
          : "⚠️ Your record/activity has been unpublished."}
      </h2>

      <p style="font-size:15px;">Dear <b>${uru.applicantName}</b>,</p>
      <p style="font-size:15px;color:#555;">
        ${isPublished
          ? `We are happy to inform you that your <b>Unique Records of Universe</b> application fee has been successfully received and your record is published.`
          : `We would like to notify you that your <b>Unique Records of Universe</b> application has been unpublished.`}
      </p>

      <!-- Record Details -->
      <div style="background:#f9fafb;border:1px solid #e1e8ed;border-radius:8px;padding:15px;margin:20px 0;">
        <h3 style="margin:0 0 10px;font-size:16px;color:#2c3e50;">Application Details</h3>
        <ul style="list-style:none;padding:0;margin:0;font-size:14px;">
          <li style="padding:6px 0;"><b>Position:</b> ${uru.position || "N/A"}</li>
          <li style="padding:6px 0;"><b>Application Number:</b> ${uru.applicationNumber}</li>
          <li style="padding:6px 0;"><b>Application Date:</b> ${uru.createdAt ? new Date(uru.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric'}) : "N/A"}</li>
          <li style="padding:6px 0;"><b>Registration Number:</b> ${uru.regNo || "N/A"}</li>
          <li style="padding:6px 0;"><b>Applicant Name:</b> ${uru.applicantName}</li>
          <li style="padding:6px 0;"><b>Email:</b> ${uru.emailId}</li>
          <li style="padding:6px 0;"><b>Status:</b> <span style="font-weight:600;color:${isPublished ? "#27ae60" : "#e74c3c"};">${isPublished ? "Published" : "Unpublished"}</span></li>
        </ul>
      </div>

      <p style="font-size:15px;margin-top:15px;">
        ${isPublished
          ? "Our verification team will now proceed with the next steps, and you will receive updates soon."
          : "If you believe this was done in error, kindly reach out to our support team."}
      </p>

      <!-- Call to Action -->
      <div style="text-align:center;margin:0px 0;">
        <a href="mailto:uruonline2025@gmail.com" 
          style="background:#27ae60;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;margin:0 8px;box-shadow:0 3px 6px rgba(0,0,0,0.1);">
          📩 Contact Support
        </a>
        <a href="https://ouruniverse.in/achievers" 
          style="background:#2980b9;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;margin:0 8px;box-shadow:0 3px 6px rgba(0,0,0,0.1);">
          📜 Check Out Post
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f4f6f9;padding:15px;text-align:center;font-size:13px;color:#777;">
      <p style="margin:5px 0;">📌 For any queries, reach us at 
        <a href="mailto:uruonline2025@gmail.com" style="color:#2980b9;">uruonline2025@gmail.com</a>
      </p>
      <p style="margin:5px 0;color:#aaa;">© ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</p>
    </div>
  </div>
  `,
};


      // ✅ Send mail only if Published
      if (isPublished) {
        await transporter.sendMail(mailOptions);
      }

      res.status(200).json({
        message: `URU has been ${isPublished ? "Published" : "Unpublished"} successfully`,
        data: uru,
      });
    } catch (error) {
      console.error("Publish/Unpublish Error:", error);
      res.status(500).json({ message: error.message });
    }
  },
  // controllers/uruController.js
fetchPublishedUruById: async (req, res) => {
  try {
    const { id } = req.params;

    const uru = await URU.findOne({ _id: id, isPublished: true })
      .select("-razorpayOrderId -razorpayPaymentId -razorpaySignature -price -paymentStatus"); // hide payment fields

    if (!uru) {
      return res.status(404).json({ message: "Published URU not found" });
    }

    res.status(200).json(uru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

fetchPublishedUru: async (req, res) => {
  try {
    const urus = await URU.find({ isPublished: true })
      .select("-razorpayOrderId -razorpayPaymentId -razorpaySignature -price -paymentStatus");

    res.status(200).json(urus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  downloadApplicationForm: async (req, res) => {
  try {
    const { applicationNumber } = req.params;
    const uru = await URU.findOne({ applicationNumber });

    if (!uru) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Remove sensitive/payment fields
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      price,
      paymentStatus,
      ...cleanData
    } = uru.toObject();

    // Create PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${applicationNumber}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // ================== HEADER ==================
    doc
      .rect(0, 0, doc.page.width, 70)
      .fill("#041e22"); // header background
    doc
      .fillColor("#ffffff")
      .fontSize(22)
      .text("Unique Records of Universe", 40, 25, { align: "left" })
      .fontSize(12)
      .text("Official Application Form", { align: "right" });

    doc.moveDown(3);

    // Draw separator line
    doc.moveTo(40, 100).lineTo(doc.page.width - 40, 100).stroke("#cccccc");

    doc.moveDown(2);

    // ================== HELPER ==================
    const addField = (label, value, x = 60) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#000")
        .text(`${label}:`, x, doc.y, { continued: true });
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#444")
        .text(` ${value || "N/A"}`);
      doc.moveDown(0.3);
    };

    const addSection = (title) => {
      doc
        .moveDown(1)
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#041e22")
        .text(title, { underline: true });
      doc.moveDown(0.5);
    };
const addTable = (title, rows) => {
  doc.moveDown(1);

  // Title Bar
  doc
    .rect(40, doc.y, doc.page.width - 80, 22)
    .fill("#041e22")
    .stroke()
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(title, 50, doc.y + 5);

  doc.moveDown(2);

  const rowHeight = 22;
  let y = doc.y;

  rows.forEach((row, i) => {
    // ✅ Page break check
    if (y + rowHeight > doc.page.height - 60) {
      doc.addPage();
      y = 60; // reset cursor
    }

    const bgColor = i % 2 === 0 ? "#f8f9fa" : "#e9f7ef";
    doc.rect(40, y, doc.page.width - 80, rowHeight).fill(bgColor);

    // Label
    if (row.label) {
      doc
        .fillColor("#041e22")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(row.label, 50, y + 6, { width: 200 });
    }

    // Value
    doc
      .fillColor("#333")
      .font("Helvetica")
      .fontSize(10)
      .text(row.value || "N/A", 260, y + 6, {
        width: doc.page.width - 320,
      });

    y += rowHeight;
    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).stroke("#ccc");
  });

  doc.y = y + 10; // keep cursor aligned instead of moveDown()
};


    // ================== APPLICANT INFO ==================
  // Applicant Details
  addTable("Applicant Details", [
    { label: "Application Number", value: uru.applicationNumber },
    { label: "Reg No", value: uru.regNo },
    { label: "Applicant Name", value: uru.applicantName },
    { label: "Sex", value: uru.sex },
    { label: "Date of Birth", value: uru.dateOfBirth ? new Date(uru.dateOfBirth).toDateString() : "N/A" },
    { label: "Address", value: uru.address },
    { label: "District", value: uru.district },
    { label: "State", value: uru.state },
    { label: "Country", value: uru.country },
    { label: "Pincode", value: uru.pinCode },
    { label: "Mobile", value: uru.whatsappMobileNumber },
    { label: "Email", value: uru.emailId },
    { label: "Occupation", value: uru.occupation },
    { label: "Education", value: uru.educationalQualification },
  ]);

      // ================== RECORD INFO ==================
      addSection("Record Details");

      addField("Form Category", uru.formCategory);
      addField("Record Category", uru.recordCategory);
      addField("Record Title", uru.recordTitle);
      addField("Record Description", uru.recordDescription);
      addField("Purpose of Attempt", uru.purposeOfRecordAttempt);
      addField(
        "Date of Attempt",
        uru.dateOfAttempt ? new Date(uru.dateOfAttempt).toDateString() : "N/A"
      );
      addField("Venue", uru.recordVenue);
      addField("Organisation", uru.organisationName);

  // ================== WITNESSES ==================
  const witnessRows = [];
  if (uru.witness1) {
    witnessRows.push(
      { label: "Witness 1 Name", value: uru.witness1.name },
      { label: "Designation", value: uru.witness1.designation },
      { label: "Address", value: uru.witness1.address },
      { label: "Mobile", value: uru.witness1.mobileNumber },
      { label: "Email", value: uru.witness1.emailId }
    );
  }
  if (uru.witness2) {
    witnessRows.push(
      { label: "Witness 2 Name", value: uru.witness2.name },
      { label: "Designation", value: uru.witness2.designation },
      { label: "Address", value: uru.witness2.address },
      { label: "Mobile", value: uru.witness2.mobileNumber },
      { label: "Email", value: uru.witness2.emailId }
    );
  }
  if (witnessRows.length > 0) {
    addTable("Witnesses", witnessRows);
  }
// ================== SOCIAL LINKS ==================
const socialRows = [];
const mediaLinks = [
  { label: "Google Drive", value: uru.googleDriveLink },
  { label: "Facebook", value: uru.facebookLink },
  { label: "YouTube", value: uru.youtubeLink },
  { label: "Instagram", value: uru.instagramLink },
  { label: "LinkedIn", value: uru.linkedInLink },
  { label: "X (Twitter)", value: uru.xLink },
  { label: "Pinterest", value: uru.pinterestLink },
  { label: "Other", value: uru.otherMediaLink },
];

// Expand multiple links as separate rows
mediaLinks.forEach((link) => {
  if (Array.isArray(link.value) && link.value.length > 0) {
    link.value.forEach((val, idx) => {
      socialRows.push({
        label: idx === 0 ? link.label : "", // only show label once
        value: val,
      });
    });
  } else if (typeof link.value === "string" && link.value.trim().length > 0) {
    socialRows.push({ label: link.label, value: link.value });
  }
});

if (socialRows.length > 0) {
  addTable("Social / Media Links", socialRows);
}


    // ================== FOOTER ==================
    const bottom = doc.page.height - 50;
    doc
      .moveTo(40, bottom - 15)
      .lineTo(doc.page.width - 40, bottom - 15)
      .stroke("#cccccc");
    doc
      .fontSize(10)
      .fillColor("#666")
      .text("Unique Records of Universe © All Rights Reserved", 40, bottom, {
        align: "center",
        width: doc.page.width - 80,
      });

    // ================== END ==================
    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Error generating application PDF" });
  }
  },
};
