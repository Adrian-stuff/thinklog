const express = require('express');
const router = express.Router();
const sql = require('../config/db');

// Get reaction counts for multiple posts
router.get('/batch', async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(',').filter(id => id.trim() !== '') : [];
    if (ids.length === 0) return res.json({});

    const reactions = await sql`
      SELECT post_id, reaction_type, count(*) as count
      FROM reactions
      WHERE post_id = ANY(${ids})
      GROUP BY post_id, reaction_type
    `;

    const batchCounts = reactions.reduce((acc, curr) => {
      const postId = curr.post_id;
      if (!acc[postId]) acc[postId] = {};
      acc[postId][curr.reaction_type] = parseInt(curr.count);
      return acc;
    }, {});

    res.json(batchCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reaction counts for a post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const reactions = await sql`
      SELECT reaction_type, count(*) as count
      FROM reactions
      WHERE post_id = ${postId}
      GROUP BY reaction_type
    `;

    const counts = reactions.reduce((acc, curr) => {
      acc[curr.reaction_type] = parseInt(curr.count);
      return acc;
    }, {});

    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
