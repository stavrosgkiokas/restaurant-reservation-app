const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/reservations', authenticateToken, async (req, res) => {
  const { restaurant_id, date, time, people_count } = req.body;
  const user_id = req.user.user_id;

  try {
    await db.query(
      'INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
      [user_id, restaurant_id, date, time, people_count]
    );
    res.status(201).json({ message: 'Reservation successful' });
  } catch (err) {
    res.status(500).json({ error: 'Reservation failed', details: err });
  }
});

router.get('/reservations/user', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const [results] = await db.query(
      `SELECT r.*, rest.name AS restaurant
       FROM reservations r
       JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
       WHERE r.user_id = ?
       ORDER BY r.date DESC, r.time DESC`,
      [user_id]
    );

    const formattedResults = results.map(r => ({
      ...r,
      date: r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date,
      time: typeof r.time === 'string' ? r.time : r.time?.toString().split(' ')[0] || '',
    }));

    res.status(200).json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations', details: err });
  }
});

router.delete('/reservations/:id', authenticateToken, async (req, res) => {
  const reservation_id = req.params.id;
  const user_id = req.user.user_id;

  try {
    const [result] = await db.query(
      'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
      [reservation_id, user_id]
    );
    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Not authorized or reservation not found' });
    }
    res.status(200).json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

module.exports = router;
