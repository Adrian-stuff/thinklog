const express = require('express');
const router = express.Router();
const sql = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const feeds = await sql`
      SELECT f.*, count(p.id) as post_count
      FROM feeds f
      LEFT JOIN posts p ON p.feed_id = f.id
      WHERE f.is_active = true
      GROUP BY f.id
      ORDER BY f.name ASC
    `;

    res.json(feeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
