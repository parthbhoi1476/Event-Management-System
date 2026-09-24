import pool from "./config/db.js";

const checkUsers = async () => {
    try {
        const [rows] = await pool.query("SELECT email, role FROM users LIMIT 10");
        console.log("USERS AND ROLES:");
        console.table(rows);
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

checkUsers();
