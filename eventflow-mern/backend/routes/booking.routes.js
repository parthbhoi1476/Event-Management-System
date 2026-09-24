import express from "express";
import pool from "../config/db.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// GET /api/booking?email=xxx — user's bookings with event details
router.get("/", verifyToken, async (req, res) => {
  try {
    const email = req.query.email;
    let query = `
      SELECT 
        b.id, b.user_email, b.event_id, b.booking_date,
        e.title AS eventTitle,
        e.image AS eventImage,
        e.date AS eventDate,
        e.start_time AS startTime,
        e.end_time AS endTime,
        e.price
      FROM bookings b
      JOIN events e ON b.event_id = e.id
    `;
    const params = [];

    if (email) {
      query += " WHERE b.user_email = ?";
      params.push(email.toLowerCase());
    }

    query += " ORDER BY b.booking_date DESC";

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/booking — book a ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userEmail, eventId } = req.body;

    if (!userEmail || !eventId) {
      return res
        .status(400)
        .json({ error: "Email and Event ID are required." });
    }

    // Fetch to check available seats
    const [eventsList] = await pool.query("SELECT available_seats FROM events WHERE id = ?", [eventId]);
    if (eventsList.length === 0) return res.status(404).json({ error: "Event not found" });
    if (eventsList[0].available_seats <= 0) return res.status(400).json({ error: "Event is completely sold out!" });

    // Check for duplicate booking
    const [existing] = await pool.query(
      "SELECT id FROM bookings WHERE user_email = ? AND event_id = ?",
      [userEmail.toLowerCase(), eventId]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already booked this ticket." });
    }

    const [result] = await pool.query(
      "INSERT INTO bookings (user_email, event_id) VALUES (?, ?)",
      [userEmail.toLowerCase(), eventId]
    );

    // Decrement capacity
    await pool.query("UPDATE events SET available_seats = available_seats - 1 WHERE id = ?", [eventId]);

    return res.status(201).json({
      message: "Booking successful",
      bookingId: result.insertId,
    });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/booking/:id — cancel a booking
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get event ID before deleting to restore capacity
    const [bookingDetails] = await pool.query("SELECT event_id FROM bookings WHERE id = ?", [id]);
    if (bookingDetails.length === 0) {
        return res.status(404).json({ error: "Booking not found" });
    }
    const eventId = bookingDetails[0].event_id;

    const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [
      id,
    ]);

    // Restore capacity 
    if (result.affectedRows > 0) {
        await pool.query("UPDATE events SET available_seats = available_seats + 1 WHERE id = ?", [eventId]);
    }

    return res.json({
      message: "Booking cancelled successfully",
      deletedCount: 1,
    });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
