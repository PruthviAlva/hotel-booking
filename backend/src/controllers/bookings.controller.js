import { pool } from '../db/pool.js';

export async function createBooking(req, res) {
    const { customerId, roomId, checkIn, checkOut, guests, totalAmount } = req.body;

    if (!customerId || !roomId || !checkIn || !checkOut || !guests || !totalAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO bookings (customer_id, room_id, check_in, check_out, guests, total_amount, booking_status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending', 'Pending')
       RETURNING id, booking_status, payment_status`,
            [customerId, roomId, checkIn, checkOut, guests, totalAmount]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Postgres error code 23P01 = exclusion_violation → our EXCLUDE constraint fired
        if (err.code === '23P01') {
            return res.status(409).json({ error: 'Room is no longer available for these dates' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
}

export async function mockPayment(req, res) {
    const { bookingId, paymentMethod } = req.body;

    try {
        // simulate: 90% success, 10% failure, like a real gateway would sometimes fail
        const success = Math.random() > 0.1;
        const transactionId = 'TXN' + Date.now();

        await pool.query(
            `INSERT INTO payments (booking_id, amount, payment_method, transaction_id, status)
       SELECT $1, total_amount, $2, $3, $4 FROM bookings WHERE id = $1`,
            [bookingId, paymentMethod, transactionId, success ? 'Success' : 'Failed']
        );

        if (success) {
            await pool.query(
                `UPDATE bookings SET booking_status = 'Confirmed', payment_status = 'Paid' WHERE id = $1`,
                [bookingId]
            );
            return res.json({ status: 'Success', transactionId, bookingId });
        } else {
            await pool.query(
                `UPDATE bookings SET booking_status = 'Cancelled', payment_status = 'Pending' WHERE id = $1`,
                [bookingId]
            );
            return res.status(402).json({ status: 'Failed', message: 'Payment failed, booking cancelled' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Payment processing failed' });
    }
}

export async function getBookingsByCustomer(req, res) {
    try {
        const { customerId } = req.params;
        const result = await pool.query(
            `SELECT bookings.*, rooms.room_number, rooms.room_type, hotels.name AS hotel_name
       FROM bookings
       JOIN rooms ON bookings.room_id = rooms.id
       JOIN hotels ON rooms.hotel_id = hotels.id
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
            [customerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

export async function cancelBooking(req, res) {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `UPDATE bookings SET booking_status = 'Cancelled' WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
}