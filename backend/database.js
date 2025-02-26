const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Create tables
db.serialize(() => {
  // Admin table for authentication
  db.run(
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )`
  );

  // Form submissions table
  db.run(
    `CREATE TABLE IF NOT EXISTS form_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT
    )`
  );
});

module.exports = db;
