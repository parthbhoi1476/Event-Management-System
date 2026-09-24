import pool from "./config/db.js";

const migrate = async () => {
  try {
    console.log("Adding role column to users table...");
    await pool.query("ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'");
    console.log("Migration successful!");
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Column 'role' already exists. Safe to ignore.");
    } else {
      console.error("Migration error:", error);
    }
  }
  process.exit();
};

migrate();
