const EventRegistration = require("../Model/eventRegistrationSchema");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// ✅ Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uruonline2025@gmail.com",
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});


exports.registerForEvent = async (req, res) => {
  try {
    const {
      eventName,
      applicantName,
      sex,
      dateOfBirth,
      phone,
      pinCode,
      district,
      state,
      email,
      website,
      education,
      skills,
      bioDataUrl,
      passportPhotoUrl,
      orderId,
      paymentId,
      amount,
      currency,
      method,
      status,
    } = req.body;

    if (!eventName || !applicantName || !phone || !orderId || !paymentId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let validDateOfBirth = null;
    if (dateOfBirth && dateOfBirth !== "N/A" && dateOfBirth !== "") {
      const parsedDate = new Date(dateOfBirth);
      if (!isNaN(parsedDate)) validDateOfBirth = parsedDate;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const applicationNumber = `URU-${new Date().getFullYear()}-${randomNum}`;

    const newRegistration = new EventRegistration({
      eventName,
      applicantName,
      sex,
      dateOfBirth: validDateOfBirth,
      phone,
      pinCode,
      district,
      state,
      email,
      website,
      education,
      skills,
      bioDataUrl,
      passportPhotoUrl,
      orderId,
      paymentId,
      amount,
      currency,
      method,
      status,
      applicationNumber,
    });

    await newRegistration.save();

  
    // ✅ Send confirmation email
    const mailOptions = {
      from: '"Unique Records of Universe" <uruonline2025@gmail.com>',
      to: email,
      subject: `✅ Registration Confirmed - ${eventName}`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
        <table align="center" cellpadding="0" cellspacing="0" width="600" style="margin:auto; background:#fff; border-radius:10px; border:1px solid #e0e0e0;">
          <tr style="background:linear-gradient(90deg,#2c3e50,#34495e); color:#fff; text-align:center;">
            <td style="padding:25px;">
              <h1 style="margin:0;">Unique Records of Universe</h1>
              <p>Recognizing Achievements Worldwide</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333;">
              <h2>Hello ${applicantName},</h2>
              <p>We’re thrilled to confirm your registration for <b>${eventName}</b>.</p>

              <div style="background:#f0f8ff; border-left:5px solid #1e90ff; padding:15px; margin:20px 0;">
                <strong>📌 Application Number:</strong> <span style="color:#1e90ff;">${applicationNumber}</span>
              </div>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px; border:1px solid #e0e0e0;">
                <tr style="background:#f5f5f5;">
                  <th style="padding:10px;">Payment ID</th>
                  <th style="padding:10px;">Amount</th>
                  <th style="padding:10px;">Status</th>
                </tr>
                <tr>
                  <td style="padding:10px;">${paymentId}</td>
                  <td style="padding:10px;">₹${amount}</td>
                  <td style="padding:10px; color:green;">Success</td>
                </tr>
              </table>

              <div style="text-align:center; margin-top:30px;">
                <a href="https://ouruniverse.in/login" style="background:#1e90ff; color:#fff; padding:12px 25px; border-radius:5px; text-decoration:none;">🚀 Go to Dashboard</a>
              </div>
            </td>
          </tr>
          <tr style="background:#f5f5f5; text-align:center; font-size:12px; color:#777;">
            <td style="padding:15px;">&copy; ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</td>
          </tr>
        </table>
      </div>
      `,
    };


    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Registration successful and confirmation email sent.",
      data: newRegistration,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// ---------------------- GET ALL REGISTRATIONS ----------------------
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find().sort({ date: -1 });
    res.status(200).json({ data: registrations });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- GET REGISTRATION BY ID ----------------------
exports.getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await EventRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json({ data: registration });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- TRACK EVENT STATUS ----------------------
exports.trackEventStatus = async (req, res) => {
  try {
    const { applicationNumber } = req.params;
    const registration = await EventRegistration.findOne({ applicationNumber });
if (!registration) return res.status(404).json({ message: "Registration not found" });

    res.status(200).json({
      applicationNumber: registration.applicationNumber,
      eventName: registration.eventName,
      applicantName: registration.applicantName,
      status: registration.status,
      paymentId: registration.paymentId,
      amount: registration.amount,
      date: registration.date,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};



// ---------------------- SEND REGISTRATION EMAIL ----------------------
exports.sendRegistrationEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await EventRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const {
      applicantName,
      email,
      eventName,
      paymentId,
      amount,
      applicationNumber,
    } = registration;

    const mailOptions = {
      from: '"Unique Records of Universe" <uruonline2025@gmail.com>',
      to: email,
      subject: `✅ Registration Confirmation - ${eventName}`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
        <table align="center" cellpadding="0" cellspacing="0" width="600" style="margin:auto; background:#ffffff; border-radius:10px; border:1px solid #e0e0e0;">
          <tr style="background: linear-gradient(90deg,#2c3e50,#34495e); color:#fff; text-align:center;">
            <td style="padding:25px;">
              <h1>Unique Records of Universe</h1>
              <p>Recognizing Achievements Worldwide</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333;">
              <h2>Hello ${applicantName},</h2>
              <p>Your registration for <b>${eventName}</b> has been successfully received!</p>

              <div style="background:#f0f8ff; border-left:5px solid #1e90ff; padding:15px; margin:20px 0;">
                <strong>📌 Application Number:</strong> <span style="color:#1e90ff;">${applicationNumber}</span>
              </div>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px; border:1px solid #e0e0e0;">
                <tr style="background:#f5f5f5;">
                  <th style="padding:10px;">Payment ID</th>
                  <th style="padding:10px;">Amount</th>
                  <th style="padding:10px;">Status</th>
                </tr>
                <tr>
                  <td style="padding:10px;">${paymentId}</td>
                  <td style="padding:10px;">₹${amount}</td>
                  <td style="padding:10px; color:green;">Success</td>
                </tr>
              </table>

              <div style="text-align:center; margin-top:30px;">
                <a href="https://ouruniverse.in/login" style="background:#1e90ff; color:#fff; padding:12px 25px; border-radius:5px; text-decoration:none;">🚀 Go to Dashboard</a>
              </div>
            </td>
          </tr>
          <tr style="background:#f5f5f5; text-align:center; font-size:12px; color:#777;">
            <td style="padding:15px;">&copy; ${new Date().getFullYear()} Unique Records of Universe. All Rights Reserved.</td>
          </tr>
        </table>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Registration confirmation email sent successfully.",
    });
  } catch (error) {
    console.error("Error sending registration email:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ---------------------- DELETE REGISTRATION ----------------------
exports.deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await EventRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const deleteFile = async (fileUrl) => {
      if (!fileUrl) return;
      try {
        if (fileUrl.includes("cloudinary.com")) {
          const parts = fileUrl.split("/");
          const filename = parts[parts.length - 1];
          const publicId = filename.split(".")[0];
          await cloudinary.uploader.destroy(publicId);
          console.log("✅ Deleted from Cloudinary:", publicId);
        } else {
          const filePath = path.join(__dirname, "..", fileUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("🗑️ Deleted local file:", filePath);
          }
        }
      } catch (err) {
        console.error("Error deleting file:", err.message);
      }
    };

    await Promise.all([
      deleteFile(registration.bioDataUrl),
      deleteFile(registration.passportPhotoUrl),
    ]);

    await EventRegistration.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Registration and related uploaded files deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
