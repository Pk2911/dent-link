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

// 1. The Route to Initialize the Database
app.get('/initdb', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      // Create a sample table
      await client.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100) UNIQUE
        );
      `);
      res.send("Database initialized successfully! Table 'patients' created.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error initializing database: " + err.message);
  }
});

// 2. The Root Route (Optional, fixes the white "Cannot GET /" screen)
app.get('/', (req, res) => {
  res.send('DentLink API is running! 🚀');
});

// 3. Start the Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
