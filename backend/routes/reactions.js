const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
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

// Toggle reaction
router.post('/', async (req, res) => {
  try {
    const { postId, reactionType } = req.body;
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if reaction exists
    const [existing] = await sql`
      SELECT id FROM reactions 
      WHERE post_id = ${postId} AND user_id = ${user.id} AND reaction_type = ${reactionType}
    `;

    if (existing) {
      await sql`DELETE FROM reactions WHERE id = ${existing.id}`;
      return res.json({ message: 'Reaction removed', added: false });
    } else {
      const [newReaction] = await sql`
        INSERT INTO reactions (post_id, user_id, reaction_type)
        VALUES (${postId}, ${user.id}, ${reactionType})
        RETURNING *
      `;
      return res.status(201).json({ message: 'Reaction added', added: true, data: newReaction });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
