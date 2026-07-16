import { pool } from '../db/pool.js';

export async function getDashboardStats(req, res) {
    try {
        const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM rooms) AS total_rooms,
        (SELECT COUNT(*) FROM rooms WHERE status = 'Available') AS available_rooms,
        (SELECT COUNT(*) FROM bookings) AS total_bookings,
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE payment_status = 'Paid') AS revenue
    `);
        res.json(stats.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
}