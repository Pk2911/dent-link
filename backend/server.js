// backend/server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- SERVE FRONTEND ---
app.use(express.static(path.join(__dirname, 'public'))); 

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// --- ROUTES ---

// 1. Initialize Database (SECURED: Commented out to prevent accidental deletion)
/* app.get('/initdb', async (req, res) => {
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
      res.send("Database reset! New table created.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error initializing database: " + err.message);
  }
});
*/

// 2. GET ALL PATIENTS
app.get('/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY id ASC'); // Added ORDER BY so list doesn't jump around
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// 3. ADD PATIENT
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

// 4. DELETE A PATIENT
app.delete('/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// 5. UPDATE A PATIENT (New Feature!)
app.put('/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, appointment_date } = req.body;
    const result = await pool.query(
      'UPDATE patients SET name = $1, email = $2, phone = $3, appointment_date = $4 WHERE id = $5 RETURNING *',
      [name, email, phone, appointment_date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});