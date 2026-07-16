import { pool } from '../db/pool.js';

export async function getRooms(req, res) {
    try {
        const { checkIn, checkOut, guests } = req.query;
        let result;

        if (checkIn && checkOut && guests) {
            result = await pool.query(
                `SELECT * FROM rooms WHERE capacity >= $1
        AND NOT EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.room_id = rooms.id
            AND bookings.check_in < $2
            AND bookings.check_out > $3
            AND bookings.booking_status != 'Cancelled'
        )`, [guests, checkOut, checkIn]
            );
        } else {
            result = await pool.query('SELECT * FROM rooms');
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
}

export async function getRoomById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT rooms.*, hotels.name AS hotel_name, hotels.address, hotels.amenities, hotels.description AS hotel_description
       FROM rooms JOIN hotels ON rooms.hotel_id = hotels.id
       WHERE rooms.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
}