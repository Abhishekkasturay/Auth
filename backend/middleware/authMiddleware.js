const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  console.log("📌 Incoming Headers:", req.headers);
  console.log("📌 Incoming Cookies:", req.cookies);

  // ✅ Extract token from Cookies or Authorization Header
  let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("❌ No token found, authorization denied.");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // ✅ Verify JWT and attach user to request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded Successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
