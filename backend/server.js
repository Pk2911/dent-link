// backend/server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 1. Initialize DB (Run this once to create tables)
app.get('/init-db', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                specialization VARCHAR(100)
            );
            CREATE TABLE IF NOT EXISTS slots (
                id SERIAL PRIMARY KEY,
                doctor_id INT REFERENCES doctors(id),
                time VARCHAR(50) NOT NULL,
                is_booked BOOLEAN DEFAULT FALSE
            );
            INSERT INTO doctors (name, specialization) VALUES ('Dr. House', 'Diagnostic') ON CONFLICT DO NOTHING;
            INSERT INTO slots (doctor_id, time) VALUES (1, '10:00 AM'), (1, '11:00 AM') ON CONFLICT DO NOTHING;
        `);
        res.send("Database Initialized!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 2. Get All Slots
app.get('/api/slots', async (req, res) => {
    const result = await pool.query('SELECT * FROM slots ORDER BY id');
    res.json(result.rows);
});

// 3. BOOKING (The Critical "Stand Out" Feature)
app.post('/api/book', async (req, res) => {
    const client = await pool.connect();
    const { slotId } = req.body;

    try {
        await client.query('BEGIN'); // Start Transaction

        // LOCK the row so no one else can read/write it until we are done
        const slotCheck = await client.query(
            'SELECT is_booked FROM slots WHERE id = $1 FOR UPDATE',
            [slotId]
        );

        if (slotCheck.rows.length === 0) {
            throw new Error('Slot not found');
        }

        if (slotCheck.rows[0].is_booked) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'Already Booked!' });
        }

        // Update Slot
        await client.query('UPDATE slots SET is_booked = TRUE WHERE id = $1', [slotId]);
        
        await client.query('COMMIT'); // Commit Transaction
        res.json({ message: 'Booking Success!' });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: err.message });
    } finally {
        client.release();
    }
});

app.get('/', (req, res) => {
  res.send('Hello! The server is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));