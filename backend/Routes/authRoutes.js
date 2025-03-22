const express = require("express");
const { register, login, getUser, logout, isTokenBlacklisted } = require("../Controllers/authController");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateUser, isTokenBlacklisted, getUser);
router.post("/logout", authenticateUser, logout);  // ✅ Add logout route

module.exports = router;
