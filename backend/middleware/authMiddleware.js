const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  let token;

  // Check for JWT in cookies (for normal authentication)
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check for JWT in request body (for password reset)
  if (req.body.token) {
    token = req.body.token;
  }

  // Check for JWT in query parameters (for reset links)
  if (req.query.token) {
    token = req.query.token;
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
