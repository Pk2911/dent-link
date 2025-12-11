// backend/server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON from incoming requests

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// --- ROUTES ---

// 1. Initialize Database (Create Table)
app.get('/initdb', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
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

// 2. GET ALL PATIENTS
app.get('/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// 3. ADD A NEW PATIENT (POST)
app.post('/patients', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      'INSERT INTO patients (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// 4. Root Route (Home Page)
app.get('/', (req, res) => {
  res.send('DentLink API is running! 🚀');
});

// --- SERVER START ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
