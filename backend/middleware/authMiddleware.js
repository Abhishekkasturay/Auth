const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  let token;

  // ✅ Debugging Logs (Check if token is received)
  console.log("🔍 Incoming Headers:", req.headers);
  console.log("🔍 Incoming Cookies:", req.cookies);

  // Check for JWT in cookies (preferred method for authentication)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Check for JWT in request body (for password reset)
  else if (req.body?.token) {
    token = req.body.token;
  }

  // Check for JWT in query parameters (for reset links)
  else if (req.query?.token) {
    token = req.query.token;
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // ✅ Verify token and attach user to request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ User Decoded from JWT:", decoded);
    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
