const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // For generating unique ID


// Store blacklisted tokens (in-memory, replace with Redis in production)
const tokenBlacklist = new Set();


exports.register = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a Unique User ID (Format: 23OS48943072)
    const uniqueId = `${new Date().getFullYear().toString().slice(2)}OS${crypto.randomInt(100000, 999999)}`;

    const newUser = new User({ fullName, phoneNumber, email, password: hashedPassword, uniqueId });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", uniqueId });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Update last login timestamp
    const currentDate = new Date();
    user.lastLogin = currentDate;
    await user.save();

    // Format lastLogin date for better readability
    const formattedLastLogin = `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}:${currentDate.getSeconds().toString().padStart(2, "0")}`;

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        uniqueId: user.uniqueId,
        lastLogin: formattedLastLogin, // Send formatted date
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.logout = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    console.log("Received Token in Backend:", token);

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      console.log("Decoded Token:", decoded);

      // Blacklist the token
      tokenBlacklist.add(token);
      res.status(200).json({ message: "User logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Middleware to check if token is blacklisted
exports.isTokenBlacklisted = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }

  next();
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fullName uniqueId email lastLogin");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      fullName: user.fullName,
      uniqueId: user.uniqueId,
      email: user.email,  // Include email in response
      lastLogin: user.lastLogin
        ? `${user.lastLogin.getDate().toString().padStart(2, "0")}-${(user.lastLogin.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${user.lastLogin.getFullYear()} ${user.lastLogin
            .getHours()
            .toString()
            .padStart(2, "0")}:${user.lastLogin.getMinutes().toString().padStart(2, "0")}:${user.lastLogin
            .getSeconds()
            .toString()
            .padStart(2, "0")}`
        : "Never Logged In",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
