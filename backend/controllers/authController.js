const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();


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


  res.cookie("token", token, {
  httpOnly: true,     
  secure: true,        
  sameSite: "None",    
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


exports.getProfile = async (req, res) => {
  console.log("Decoded User from JWT:", req.user);
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("name email"); 
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ name: user.name, email: user.email }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};


exports.getDashboard = async (req, res) => {
  res.json({ msg: "Welcome to your dashboard!", user: req.user });
};


exports.logoutHandle = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logout successful" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });


  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  
  const resetLink = `http://localhost:5174/auth/reset?token=${token}`;

  console.log("Reset Link:", resetLink); 



  res.json({ msg: "Reset email sent!", resetLink });
};


exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized - No Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Invalid or expired token" });
  }
};
