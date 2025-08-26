const FreeQuote = require('../Model/freeQuoteModel');
const nodemailer = require("nodemailer");

// @desc Create a new Free Quote
const createFreeQuote = async (req, res) => {
  const { name, email, phone, age, designation, address, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const freeQuote = new FreeQuote({
      name,
      email,
      phone,
      age,
      designation,
      address,
      message,
      isPublished: false, // default unpublished
    });

    const savedQuote = await freeQuote.save();

    // ===== Nodemailer Setup =====
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   
    const mailOptions = {
      from: `"UNIQUE RECORD OF UNIVERSE ADMIN TEAM" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Thank you for contacting us - UNIQUE RECORD OF UNIVERSE",
      html: `
        <div style="background-color:#f4f6f9; padding:40px 0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
            <div style="background:linear-gradient(135deg,#2c3e50,#3498db); padding:20px; text-align:center;">
              <h1 style="color:#fff; margin:0; font-size:24px;">UNIQUE RECORD OF UNIVERSE</h1>
              <p style="color:#dfe6e9; margin:5px 0 0;">Admin Team</p>
            </div>
            <div style="padding:30px;">
              <h2 style="color:#2c3e50; margin-top:0;">Hello ${name}, 👋</h2>
              <p style="font-size:16px; line-height:1.6; color:#34495e;">
                Thank you for reaching out to us. Your message has been received successfully. 
                Our support team will review your request and get back to you shortly.
              </p>
              <div style="margin:25px 0; padding:20px; background:#f9fbfd; border-left:6px solid #3498db; border-radius:8px;">
                <h3 style="margin:0 0 10px; color:#3498db;">📌 Your Submitted Details:</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Message:</b> ${message}</p>
              </div>
              <p style="font-size:15px; color:#555;">We truly appreciate your interest and look forward to assisting you.</p>
              <p style="margin-top:20px; font-size:15px;">Warm regards,</p>
              <p style="font-size:16px; font-weight:bold; color:#e67e22;">UNIQUE RECORD OF UNIVERSE ADMIN TEAM</p>
            </div>
            <div style="background:#f1f2f6; padding:15px; text-align:center; font-size:13px; color:#888;">
              <p style="margin:0;">This is an automated message. Please do not reply.</p>
              <p style="margin:5px 0 0;">© ${new Date().getFullYear()} Unique Record of Universe. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Quote saved and email sent ✅", data: savedQuote });

  } catch (err) {
    console.error("Error creating Free Quote:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Get all Free Quotes
const getAllFreeQuotes = async (req, res) => {
  try {
    const quotes = await FreeQuote.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: quotes });
  } catch (err) {
    console.error("Error fetching Free Quotes:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Get only Published Free Quotes
const getPublishedFreeQuotes = async (req, res) => {
  try {
    const publishedQuotes = await FreeQuote.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: publishedQuotes });
  } catch (err) {
    console.error("Error fetching published Free Quotes:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Publish/Unpublish a Free Quote
const togglePublishFreeQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body; // expects true/false from frontend

    const updatedQuote = await FreeQuote.findByIdAndUpdate(
      id,
      { isPublished },
      { new: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.status(200).json({
      message: `Quote ${isPublished ? "Published ✅" : "Unpublished ❌"}`,
      data: updatedQuote,
    });
  } catch (err) {
    console.error("Error updating publish status:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Delete a Free Quote by ID
const deleteFreeQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuote = await FreeQuote.findByIdAndDelete(id);

    if (!deletedQuote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    res.status(200).json({ message: 'Quote deleted successfully ✅' });
  } catch (err) {
    console.error("Error deleting Free Quote:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createFreeQuote,
  getAllFreeQuotes,
  getPublishedFreeQuotes,
  togglePublishFreeQuote,
  deleteFreeQuote,
};
