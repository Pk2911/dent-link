// backend/server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- CRITICAL FIX: Serve the Frontend Files ---
// This tells Express: "Look inside the 'public' folder and show index.html"
app.use(express.static('public')); 

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// --- ROUTES ---

// 1. Initialize Database (RESET & CREATE TABLE)
app.get('/initdb', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      await client.query('DROP TABLE IF EXISTS patients');
      await client.query(`
        CREATE TABLE patients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100),
          phone VARCHAR(20),
          appointment_date VARCHAR(50)
        );
      `);
      res.send("Database reset! New table created with phone & appointment_date.");
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

// 3. ADD A NEW PATIENT
app.post('/patients', async (req, res) => {
  try {
    const { name, email, phone, appointment_date } = req.body;
    
    const result = await pool.query(
      'INSERT INTO patients (name, email, phone, appointment_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, appointment_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// NOTE: I removed the "Root Route" (app.get('/')) so the index.html can load instead!

// --- SERVER START ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});