const jwt = require("jsonwebtoken");
const User = require("../Model/User");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.tokens.includes(token)) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};

module.exports = authenticateUser;
