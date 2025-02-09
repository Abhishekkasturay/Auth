const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ✅ CORS Middleware (MUST be before other middlewares)
const cors = require("cors");

app.use(cors({
  origin: 'https://auth-1-emun.onrender.com', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


// ✅ Middleware (After CORS)
app.use(express.json()); // Parses JSON requests
app.use(cookieParser()); // Handles cookies
app.use(morgan("dev")); // Logs API requests

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

// Call MongoDB Connection
connectDB();


app.use((req, res, next) => {
  console.log(`📡 API Request: ${req.method} ${req.url}`);
  next();
});


// Import authentication routes
const authRoutes = require("./routes/auth");

// ✅ Routes
app.use("/api/auth", authRoutes);

// Default Route
app.get("/", (req, res) => res.send("Hello from Express Server!"));

// ✅ Global Error Handler (Handles all errors)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ msg: "Internal Server Error", error: err.message });
});

// ✅ Handle Uncaught Errors (Prevents Server Crash)
process.on("uncaughtException", (err) => {
  console.error("🚨 Uncaught Exception:", err);
});

// Start Server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
