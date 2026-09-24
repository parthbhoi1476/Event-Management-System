import express from "express";
import pool from "../config/db.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// GET /api/users/:email — get user profile (no password)
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await pool.query(
      "SELECT id, name, email, image, phone, bio, created_at FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /api/users/:email — update profile (name, image, phone, bio)
router.put("/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const { name, image, phone, bio } = req.body;

    const [result] = await pool.query(
      "UPDATE users SET name = ?, image = ?, phone = ?, bio = ? WHERE email = ?",
      [name, image, phone, bio, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
