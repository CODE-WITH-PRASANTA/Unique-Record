const express = require("express");
const {
  register,
  login,
  getUser,
  logout,
} = require("../Controllers/authController");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateUser, getUser);
router.post("/logout", authenticateUser, logout);

module.exports = router;
