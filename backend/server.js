require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "https://chicket.vercel.app", "https://chicket.onrender.com", "https://feedback.chicketarabia.com"], credentials: true }));
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schemas & Models
const adminSchema = new mongoose.Schema({ email: String, password: String });
const feedbackSchema = new mongoose.Schema({
  date: String,
  time: String,
  name: String,
  phone: String,
  email: String,
  branch: String,
  meal: String,
  meal_temperature: String,
  cooking: String,
  speed_of_service: String,
  friendliness: String,
  dining_room: String,
  outdoor_cleanliness: String,
  visit_frequency: String,
  service_time: String,
  staff_available: String,
  bathroom_clean: String,
  uniform_clean: String,
  comments: String,
  attachment: String,
});

const Admin = mongoose.model("Admin", adminSchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Middleware for Authentication
const authenticateAdmin = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Submit Form API
app.post("/api/submit", upload.single("attachment"), async (req, res) => {
  try {
    const feedback = new Feedback({ ...req.body, attachment: req.file ? `/uploads/${req.file.filename}` : null });
    await feedback.save();
    res.json({ message: "Form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Registration
app.post("/api/admin/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = new Admin({ email, password });
    await admin.save();
    res.json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Admin already exists or an error occurred." });
  }
});

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || admin.password !== password) return res.status(401).json({ error: "Invalid email or password." });

  const token = jwt.sign({ id: admin._id, email: admin.email }, SECRET_KEY, { expiresIn: "1m" });
  res.json({ message: "Login successful!", token });
});

// Get All Submissions (Admin Only)
app.get("/api/submissions", authenticateAdmin, async (req, res) => {
  const submissions = await Feedback.find();
  res.json(submissions);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
