import { pool } from '../db/pool.js';

export async function createRoom(req, res) {
    try {
        const { hotel_id, room_number, room_type, price, capacity, description, images, status } = req.body;

        const result = await pool.query(
            `INSERT INTO rooms (hotel_id, room_number, room_type, price, capacity, description, images, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [hotel_id, room_number, room_type, price, capacity, description, images, status]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create room' });
    }
}

export async function updateRoom(req, res) {
    try {
        const { hotel_id, room_number, room_type, price, capacity, description, images, status } = req.body;

        const result = await pool.query(
            `UPDATE rooms SET hotel_id = $1, room_number = $2, room_type = $3, price = $4, capacity = $5, description = $6, images = $7, status = $8 WHERE id = $9 RETURNING *`,
            [hotel_id, room_number, room_type, price, capacity, description, images, status, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update room' });
    }
}

export async function deleteRoom(req, res) {
    try {
        const result = await pool.query(
            `DELETE FROM rooms WHERE id = $1 RETURNING *`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete room' });
    }
}

export async function getAllBookingsAdmin(req, res) {
    try {
        const result = await pool.query(
            `SELECT bookings.*, 
                    customers.name AS customer_name, customers.email AS customer_email,
                    rooms.room_number, rooms.room_type,
                    hotels.name AS hotel_name
             FROM bookings
             JOIN customers ON bookings.customer_id = customers.id
             JOIN rooms ON bookings.room_id = rooms.id
             JOIN hotels ON rooms.hotel_id = hotels.id
             ORDER BY bookings.created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get all bookings' });
    }
}