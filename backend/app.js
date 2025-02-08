const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ✅ Load Environment Variables
dotenv.config();

const app = express();

// ✅ Use CORS with Environment Variables
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ✅ Uses Render Frontend URL
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
});
