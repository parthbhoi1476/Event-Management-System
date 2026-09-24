import bcrypt from "bcryptjs";
import pool from "./config/db.js";

const fixAdmin = async () => {
  try {
    // Generate a proper bcrypt hash for "password123"
    const hash = await bcrypt.hash("password123", 10);
    console.log("Generated hash:", hash);

    // Update the admin user with a proper working password
    const [result] = await pool.query(
      "UPDATE users SET password = ?, role = 'admin' WHERE email = 'parth@example.com'",
      [hash]
    );
    console.log("Rows affected:", result.affectedRows);

    // Verify it works
    const [rows] = await pool.query("SELECT email, role FROM users WHERE email = 'parth@example.com'");
    console.log("Verified user:", rows[0]);

    // Test password comparison
    const isValid = await bcrypt.compare("password123", hash);
    console.log("Password 'password123' matches?", isValid);

  } catch (err) {
    console.error("Error:", err);
  }
  process.exit();
};

fixAdmin();
