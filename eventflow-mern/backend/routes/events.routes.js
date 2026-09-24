import express from "express";
import pool from "../config/db.js";
import verifyToken, { isAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/events — all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM events ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/events/recent — latest 6 upcoming events
router.get("/recent", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM events WHERE date > CURRENT_DATE() ORDER BY created_at DESC LIMIT 6"
    );
    return res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/events/my?email=xxx — owner's events
router.get("/my", verifyToken, isAdmin, async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Owner email is required" });
    }
    const [rows] = await pool.query(
      "SELECT * FROM events WHERE owner_email = ? ORDER BY created_at DESC",
      [email.toLowerCase()]
    );
    return res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/events/:id — single event
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/events — create event (protected)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      image,
      category,
      capacity,
      availableSeats,
      price,
      ownerEmail,
      organizerName,
      organizerEmail,
      startTime,
      endTime,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO events 
        (title, description, date, location, image, category, capacity, available_seats, price, owner_email, organizer_name, organizer_email, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        new Date(date),
        location,
        image,
        category,
        capacity || 0,
        availableSeats || capacity || 0,
        price || 0,
        ownerEmail?.toLowerCase(),
        organizerName,
        organizerEmail,
        startTime,
        endTime,
      ]
    );

    return res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /api/events/:id — update event (protected)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      location,
      image,
      category,
      capacity,
      availableSeats,
      price,
      organizerName,
      organizerEmail,
      startTime,
      endTime,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE events SET
        title = ?, description = ?, date = ?, location = ?, image = ?,
        category = ?, capacity = ?, available_seats = ?, price = ?,
        organizer_name = ?, organizer_email = ?, start_time = ?, end_time = ?
       WHERE id = ?`,
      [
        title,
        description,
        date ? new Date(date) : null,
        location,
        image,
        category,
        capacity,
        availableSeats,
        price,
        organizerName,
        organizerEmail,
        startTime,
        endTime,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/events/:id — delete event (protected)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.json({ message: "Event deleted successfully", deletedCount: 1 });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
