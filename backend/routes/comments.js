const express = require('express');
const router = express.Router();
const sql = require('../config/db');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await sql`
      SELECT * FROM comments 
      WHERE post_id = ${postId} 
      ORDER BY created_at ASC
    `;
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
