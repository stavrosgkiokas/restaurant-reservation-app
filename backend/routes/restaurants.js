const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/restaurants', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM restaurants');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Query failed', details: err.message });
  }
});

module.exports = router;
