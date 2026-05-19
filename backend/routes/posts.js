const express = require('express');
const router = express.Router();
const sql = require('../config/db');

// Get paginated posts with optional sort and filter
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const feedId = req.query.feedId;
    const sortBy = req.query.sortBy || 'latest';

    let posts;
    let totalCount;

    const baseJoin = sql`FROM posts p JOIN feeds f ON p.feed_id = f.id`;
    const whereClause = feedId ? sql`WHERE p.feed_id = ${feedId}` : sql``;

    if (sortBy === 'popular') {
      const [count] = await sql`SELECT count(*) ${baseJoin} ${whereClause}`;
      totalCount = parseInt(count.count);

      posts = await sql`
        SELECT p.*, f.name as feed_name,
          COALESCE(r.total_reactions, 0) as total_reactions
        ${baseJoin}
        LEFT JOIN (
          SELECT post_id, count(*) as total_reactions
          FROM reactions
          GROUP BY post_id
        ) r ON r.post_id = p.id
        ${whereClause}
        ORDER BY total_reactions DESC, p.published_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (sortBy === 'discover') {
      const [count] = await sql`SELECT count(*) ${baseJoin} ${whereClause}`;
      totalCount = parseInt(count.count);

      posts = await sql`
        SELECT p.*, f.name as feed_name
        ${baseJoin}
        ${whereClause}
        ORDER BY RANDOM()
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (sortBy === 'trending') {
      const [count] = await sql`SELECT count(*) ${baseJoin} ${whereClause}`;
      totalCount = parseInt(count.count);

      posts = await sql`
        SELECT p.*, f.name as feed_name,
          COALESCE(r.trending_reactions, 0) as trending_reactions
        ${baseJoin}
        LEFT JOIN (
          SELECT post_id, count(*) as trending_reactions
          FROM reactions
          WHERE created_at > NOW() - INTERVAL '7 days'
          GROUP BY post_id
        ) r ON r.post_id = p.id
        ${whereClause}
        ORDER BY trending_reactions DESC, p.published_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (sortBy === 'recommended') {
      const [count] = await sql`SELECT count(*) ${baseJoin} ${whereClause}`;
      totalCount = parseInt(count.count);

      const userId = req.query.userId;

      posts = await sql`
        SELECT p.*, f.name as feed_name,
          COALESCE(r.total_reactions, 0) as total_reactions
        ${baseJoin}
        LEFT JOIN (
          SELECT post_id, count(*) as total_reactions
          FROM reactions
          GROUP BY post_id
        ) r ON r.post_id = p.id
        ${whereClause}
        ORDER BY
          (CASE
            WHEN p.published_at > NOW() - INTERVAL '1 day' THEN 10
            WHEN p.published_at > NOW() - INTERVAL '3 days' THEN 8
            WHEN p.published_at > NOW() - INTERVAL '7 days' THEN 6
            WHEN p.published_at > NOW() - INTERVAL '14 days' THEN 4
            WHEN p.published_at > NOW() - INTERVAL '30 days' THEN 2
            ELSE 0
          END) * 0.4
          + COALESCE(r.total_reactions, 0) * 0.25
          + RANDOM() * 0.15
          ${userId ? sql`+ CASE WHEN p.feed_id IN (
            SELECT DISTINCT po.feed_id
            FROM reactions r2
            JOIN posts po ON po.id = r2.post_id
            WHERE r2.user_id = ${userId}
          ) THEN 2 ELSE 0 END * 0.2` : sql``}
        DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      if (feedId) {
        const [count] = await sql`SELECT count(*) FROM posts WHERE feed_id = ${feedId}`;
        totalCount = parseInt(count.count);

        posts = await sql`
          SELECT p.*, f.name as feed_name 
          FROM posts p 
          JOIN feeds f ON p.feed_id = f.id 
          WHERE p.feed_id = ${feedId}
          ORDER BY p.published_at DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
      } else {
        const [count] = await sql`SELECT count(*) FROM posts`;
        totalCount = parseInt(count.count);

        posts = await sql`
          SELECT p.*, f.name as feed_name 
          FROM posts p 
          JOIN feeds f ON p.feed_id = f.id 
          ORDER BY p.published_at DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
      }
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

module.exports = router;
