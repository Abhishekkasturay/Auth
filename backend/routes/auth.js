const express = require("express");
const router = express.Router();
const {
  registerHandle,
  loginHandle,
  logoutHandle,
  getProfile,
  getDashboard,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerHandle);
router.post("/login", loginHandle);
router.get("/logout", logoutHandle);
router.post("/forgot", forgotPassword); // ✅ Send reset link
router.post("/reset", resetPassword); // ✅ Reset password

// Protected Routes (Require Authentication)
router.get("/profile", authMiddleware, getProfile);
router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;
