const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET_KEY = "65918f9c0a106b82f507ae261729938371c8bd2f65c506d5d4c8ccaa9c7f0137";

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chicket.onrender.com", "http://feedback.chicketarabia.com/", "https://feedback.chicketarabia.com/", "http://posadmin.chicketarabia.com", "https://posadmin.chicketarabia.com"], // Allow only this frontend URL
    credentials: true, // If using cookies or authentication
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  })
);
app.use("/uploads", express.static("uploads"));

// Database Connection
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create Table
db.run(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

db.run(
  `CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    time TEXT,
    name TEXT,
    phone TEXT,
    email TEXT,
    meal TEXT,
    meal_temperature TEXT,
    cooking TEXT,
    speed_of_service TEXT,
    friendliness TEXT,
    dining_room TEXT,
    outdoor_cleanliness TEXT,
    visit_frequency TEXT,
    service_time TEXT,
    staff_available TEXT,
    bathroom_clean TEXT,
    uniform_clean TEXT,
    comments TEXT,
    attachment TEXT
  )`
);

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware for Authentication
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Submit Form API
app.post("/api/submit", upload.single("attachment"), (req, res) => {
  const formData = req.body;
  const attachment = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO feedback (
      date, time, name, phone, email, meal, meal_temperature, cooking, 
      speed_of_service, friendliness, dining_room, outdoor_cleanliness, 
      visit_frequency, service_time, staff_available, bathroom_clean, 
      uniform_clean, comments, attachment
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    formData.date,
    formData.time,
    formData.name,
    formData.phone,
    formData.email,
    formData.meal,
    formData.meal_temperature,
    formData.cooking,
    formData.speed_of_service,
    formData.friendliness,
    formData.dining_room,
    formData.outdoor_cleanliness,
    formData.visit_frequency,
    formData.service_time,
    formData.staff_available,
    formData.bathroom_clean,
    formData.uniform_clean,
    formData.comments,
    attachment,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Form submitted successfully!", id: this.lastID });
  });
});

// Admin Registration (Only for setup, remove after creating the first admin)
app.post("/api/admin/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  db.run(
    "INSERT INTO admin (email, password) VALUES (?, ?)",
    [email, password],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Admin already exists or an error occurred." });
      }
      res.json({ message: "Admin registered successfully!" });
    }
  );
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM admin WHERE email = ?", [email], async (err, admin) => {
    if (err || !admin) {
      return res.status(401).json({ error: "Invalid email." });
    }

    const isMatch = password === admin.password; 
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful!", token });
  });
});

// Get All Submissions (Admin Only)
app.get("/api/submissions", authenticateAdmin, (req, res) => {
  db.all("SELECT * FROM feedback", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
