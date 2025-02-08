const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");

//------------ Welcome Route ------------//
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

//------------ Dashboard Route (Protected) ------------//
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.json({ message: "Welcome to the dashboard", user: req.user.name });
});

module.exports = router;
