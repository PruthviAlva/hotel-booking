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

export async function getCustomerByEmail(req, res) {
    try {
        const { email } = req.params;
        const result = await pool.query(`SELECT id, name, email FROM customers WHERE email = $1`, [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
}