import { pool } from '../db/pool.js';

export async function createCustomer(req, res) {
    const { name, email, phone, location } = req.body;
    try {
        // upsert: if email exists, return existing customer instead of erroring
        const result = await pool.query(
            `INSERT INTO customers (name, email, phone, location)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, email`,
            [name, email, phone, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create customer' });
    }
}