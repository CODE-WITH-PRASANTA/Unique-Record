const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ---------------------
// Register Controller
// ---------------------
exports.register = async (req, res) => {
  try {
    let { fullName, phoneNumber, email, password, confirmPassword } = req.body;

    // Validate passwords
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Normalize inputs
    email = email.trim().toLowerCase();
    phoneNumber = phoneNumber.trim();

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID like: 25OS123456
    const uniqueId = `${new Date().getFullYear().toString().slice(2)}OS${crypto.randomInt(100000, 999999)}`;

    // Create new user
    const newUser = new User({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      uniqueId,
    });

    await newUser.save();

    // ---------------------
    // Nodemailer Transport
    // ---------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "uruonline2025@gmail.com", // Admin Gmail
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // ---------------------
    // Confirmation Email
    // ---------------------
    const mailOptions = {
      from: '"Unique Records of Universe Admin Team" <uruonline2025@gmail.com>',
      to: email,
      subject: "✅ Registration Successful – Unique Records of Universe",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
          <table align="center" width="600" cellpadding="0" cellspacing="0" 
            style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr style="background:linear-gradient(90deg,#2c3e50,#34495e); color:white;">
              <td style="padding:20px; text-align:center;">
                <h1 style="margin:0; font-size:22px;">Unique Records of Universe</h1>
                <p style="margin:0; font-size:14px;">Recognizing Achievements Worldwide</p>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333;">
                <h2 style="color:#2c3e50;">Hello ${fullName},</h2>
                <p style="font-size:15px; line-height:1.6;">
                  🎉 Welcome to <b>Unique Records of Universe</b>!  
                  Your account has been created successfully.
                </p>

                <div style="background:#f9f9f9; border-left:4px solid #e67e22; padding:15px; margin:20px 0; border-radius:4px;">
                  <p style="margin:0; font-size:15px;">
                    <b>📌 Your Unique ID:</b> 
                    <span style="color:#e67e22; font-weight:bold;">${uniqueId}</span>
                  </p>
                </div>

                <p style="font-size:15px; line-height:1.6;">
                  Please keep this Unique ID safe, as it will be required for future logins and records verification.  
                  If you have any questions, feel free to reach out to our support team.
                </p>

                <!-- Call to Action -->
                <div style="text-align:center; margin:20px 0;">
                  <a href="mailto:uruonline2025@gmail.com" 
                    style="background:#2c3e50; color:#fff; padding:12px 25px; text-decoration:none; border-radius:4px; font-size:14px;">
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
                  Unique Records of Universe Admin • 
                  <a href="mailto:uruonline2025@gmail.com" style="color:#2c3e50; text-decoration:none;">uruonline2025@gmail.com</a>
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    // Send Email (non-blocking)
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email Error:", err);
      else console.log("✅ Registration email sent:", info.response);
    });

    // Final API response
    res.status(201).json({
      message: "User registered successfully & confirmation email sent",
      uniqueId,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------
// Login Controller
// ---------------------
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Email/Phone and password are required" });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phoneNumber: emailOrPhone }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Save token and last login
    user.tokens.push(token);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        uniqueId: user.uniqueId,
        lastLogin: user.lastLogin.toLocaleString(),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------
// Get User Profile
// ---------------------
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fullName uniqueId email lastLogin");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      fullName: user.fullName,
      uniqueId: user.uniqueId,
      email: user.email,
      lastLogin: user.lastLogin
        ? `${user.lastLogin.getDate().toString().padStart(2, "0")}-${(user.lastLogin.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${user.lastLogin.getFullYear()} ${user.lastLogin
            .getHours()
            .toString()
            .padStart(2, "0")}:${user.lastLogin
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${user.lastLogin
            .getSeconds()
            .toString()
            .padStart(2, "0")}`
        : "Never Logged In",
    });
  } catch (error) {
    console.error("GetUser Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------
// Logout Controller
// ---------------------
exports.logout = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Remove the token from user's active tokens
    user.tokens = user.tokens.filter((t) => t !== token);
    await user.save();

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};
