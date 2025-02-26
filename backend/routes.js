const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Admin Registration (One-time use, remove after creating an admin)
router.post("/register-admin", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.run(
    `INSERT INTO admins (email, password) VALUES (?, ?)`,
    [email, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: "Admin already exists" });
      res.json({ message: "Admin registered successfully" });
    }
  );
});

// Admin Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM admins WHERE email = ?`, [email], async (err, admin) => {
    if (err || !admin) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  });
});

// Middleware to protect admin routes
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.admin = decoded;
    next();
  });
};

// Submit form data (Public API)
router.post("/submit-form", (req, res) => {
  const { name, phone, email } = req.body;

  db.run(
    `INSERT INTO form_data (name, phone, email) VALUES (?, ?, ?)`,
    [name, phone, email],
    function (err) {
      if (err) return res.status(500).json({ error: "Error saving data" });
      res.json({ message: "Form submitted successfully", id: this.lastID });
    }
  );
});

// Get all submitted form data (Admin only)
router.get("/form-data", authenticate, (req, res) => {
  db.all(`SELECT * FROM form_data`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error fetching data" });
    res.json(rows);
  });
});

module.exports = router;
