const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
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

// Add comment
router.post('/', async (req, res) => {
  try {
    const { postId, content, userName } = req.body;
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    // Verify user with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Insert using direct SQL
    const [newComment] = await sql`
      INSERT INTO comments (
        post_id, user_id, user_name, content
      ) VALUES (
        ${postId}, ${user.id}, ${userName || user.email.split('@')[0]}, ${content}
      )
      RETURNING *
    `;

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
