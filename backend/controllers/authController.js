const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

// @desc Register User
// @route POST /auth/register
exports.registerHandle = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// @desc Login User
// @route POST /auth/login
exports.loginHandle = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Send JWT as a HttpOnly Cookie for security
  res.cookie("token", token, {
  httpOnly: true,      // ✅ Prevents access via JavaScript
  secure: true,        // ✅ Required for HTTPS on Render
  sameSite: "None",    // ✅ REQUIRED for cross-origin cookies (since frontend & backend have different origins)
});


    res.json({
      msg: "Login successful",
      user: { id: user.id, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// @desc Get User Profile
// @route GET /auth/profile (Protected)
exports.getProfile = async (req, res) => {
  console.log("Decoded User from JWT:", req.user);
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("name email"); // Fetch only name & email
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ name: user.name, email: user.email }); // Send name & email directly
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// @desc Get Dashboard Data
// @route GET /auth/dashboard (Protected)
exports.getDashboard = async (req, res) => {
  res.json({ msg: "Welcome to your dashboard!", user: req.user });
};

// @desc Logout User
// @route GET /auth/logout
exports.logoutHandle = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logout successful" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  // ✅ Generate a reset token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // ✅ Send reset link with token
  const resetLink = `http://localhost:5174/auth/reset?token=${token}`;

  console.log("Reset Link:", resetLink); // ✅ Debugging: Ensure correct link is generated

  // TODO: Send the email with EmailJS or another service

  res.json({ msg: "Reset email sent!", resetLink });
};

// @desc Reset Password
// @route POST /auth/reset
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized - No Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Decode JWT

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // ✅ Hash New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Invalid or expired token" });
  }
};
