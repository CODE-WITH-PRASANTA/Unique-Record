const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const newUser = new User({ fullName, phoneNumber, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

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

    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });

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
