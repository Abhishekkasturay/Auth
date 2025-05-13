const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


dotenv.config();


const app = express();


const cors = require("cors");

app.use(cors({
  origin: "https://auth-1-emun.onrender.com", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json()); 
app.use(cookieParser()); 
app.use(morgan("dev")); 


app.use((req, res, next) => {
  console.log("📌 Incoming Cookies:", req.cookies); 
  next();
});

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, 
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};


connectDB();


const authRoutes = require("./routes/auth");

// ✅ Routes
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => res.send("Hello from Express Server!"));


app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ msg: "Internal Server Error", error: err.message });
});


process.on("uncaughtException", (err) => {
  console.error("🚨 Uncaught Exception:", err);
});

// Start Server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
