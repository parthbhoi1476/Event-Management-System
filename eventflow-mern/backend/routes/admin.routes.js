import express from "express";
import pool from "../config/db.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Apply middleware to all admin routes
router.use(verifyToken);
router.use(isAdmin);

// =======================
// DASHBOARD STATS
// =======================
router.get("/stats", async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'");
    const [[{ totalEvents }]] = await pool.query("SELECT COUNT(*) AS totalEvents FROM events");
    const [[{ totalBookings }]] = await pool.query("SELECT COUNT(*) AS totalBookings FROM bookings");

    return res.json({
      totalUsers,
      totalEvents,
      totalBookings
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ error: "Server error fetching stats" });
  }
});

// =======================
// USERS MANAGEMENT
// =======================
router.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email, role, image, phone, created_at FROM users ORDER BY created_at DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Don't delete other admins to prevent lockout
    const [users] = await pool.query("SELECT role FROM users WHERE id = ?", [id]);
    if (users.length && users[0].role === 'admin') {
        return res.status(403).json({ error: "Cannot delete another administrator." });
    }

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

// =======================
// EVENTS MANAGEMENT
// =======================
router.get("/events", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events ORDER BY created_at DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

// =======================
// BOOKINGS MANAGEMENT
// =======================
router.get("/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.id, b.booking_date as booked_at, e.title as eventTitle, e.date as eventDate, u.name as userName, u.email as userEmail
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_email = u.email
      ORDER BY b.booking_date DESC
    `);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get event ID before deleting to restore capacity
    const [bookingDetails] = await pool.query("SELECT event_id FROM bookings WHERE id = ?", [id]);
    if (bookingDetails.length === 0) return res.status(404).json({ error: "Booking not found" });
    const eventId = bookingDetails[0].event_id;

    const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [id]);
    
    if (result.affectedRows > 0) {
        await pool.query("UPDATE events SET available_seats = available_seats + 1 WHERE id = ?", [eventId]);
    }
    
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
});

export default router;
