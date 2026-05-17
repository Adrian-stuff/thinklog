const express = require('express');
const router = express.Router();
const sql = require('../config/db');

// Get paginated posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const feedId = req.query.feedId;

    let posts;
    let totalCount;

    if (feedId) {
      posts = await sql`
        SELECT p.*, f.name as feed_name 
        FROM posts p 
        JOIN feeds f ON p.feed_id = f.id 
        WHERE p.feed_id = ${feedId}
        ORDER BY p.published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
      const [count] = await sql`SELECT count(*) FROM posts WHERE feed_id = ${feedId}`;
      totalCount = parseInt(count.count);
    } else {
      posts = await sql`
        SELECT p.*, f.name as feed_name 
        FROM posts p 
        JOIN feeds f ON p.feed_id = f.id 
        ORDER BY p.published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
      const [count] = await sql`SELECT count(*) FROM posts`;
      totalCount = parseInt(count.count);
    }

    res.json({
      data: posts,
      metadata: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post with all details (reactions, comments) consolidated
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Aggregate post, reactions, and comments in one query
    const [data] = await sql`
      SELECT 
        p.*, 
        f.name as feed_name,
        COALESCE((
          SELECT jsonb_object_agg(reaction_type, c)
          FROM (
            SELECT reaction_type, count(*) as c
            FROM reactions
            WHERE post_id = p.id
            GROUP BY reaction_type
          ) r
        ), '{}'::jsonb) as reaction_counts,
        COALESCE((
          SELECT jsonb_agg(comm ORDER BY comm.created_at ASC)
          FROM comments comm
          WHERE comm.post_id = p.id
        ), '[]'::jsonb) as comments
      FROM posts p 
      JOIN feeds f ON p.feed_id = f.id 
      WHERE p.id = ${id}
    `;

    if (!data) return res.status(404).json({ error: 'Post not found' });

    res.json(data);
  } catch (error) {
    console.error('Error in /posts/:id/details:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [post] = await sql`
      SELECT p.*, f.name as feed_name 
      FROM posts p 
      JOIN feeds f ON p.feed_id = f.id 
      WHERE p.id = ${id}
    `;

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
