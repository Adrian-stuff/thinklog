const express = require('express');
const router = express.Router();
const sql = require('../config/db');

// Get search suggestions (autocomplete)
router.get('/suggestions', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const suggestions = await sql`
      SELECT id, title 
      FROM posts 
      WHERE title ILIKE ${'%' + query + '%'}
      ORDER BY published_at DESC
      LIMIT 5
    `;

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search posts with Redis-like UNLOGGED caching
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const cacheKey = `q:${query}|page:${page}|limit:${limit}`;

    // Check cache first
    try {
      const [cached] = await sql`
        SELECT result FROM search_cache 
        WHERE cache_key = ${cacheKey} 
        AND created_at > NOW() - INTERVAL '15 minutes'
      `;
      if (cached) {
        return res.json(cached.result);
      }
    } catch (cacheError) {
      // Ignore cache check errors if table doesn't exist yet, fallback to db search
      console.warn("Cache check failed (run migration):", cacheError.message);
    }

    // Direct Postgres full-text search
    const posts = await sql`
      SELECT p.*, f.name as feed_name,
             ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', ${query})) as rank
      FROM posts p
      JOIN feeds f ON p.feed_id = f.id
      WHERE to_tsvector('english', p.title || ' ' || p.content) @@ plainto_tsquery('english', ${query})
         OR p.title ILIKE ${'%' + query + '%'}
         OR p.content ILIKE ${'%' + query + '%'}
      ORDER BY rank DESC, p.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [count] = await sql`
      SELECT count(*) 
      FROM posts 
      WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', ${query})
         OR title ILIKE ${'%' + query + '%'}
         OR content ILIKE ${'%' + query + '%'}
    `;
    
    const totalCount = parseInt(count.count);

    const responseData = {
      data: posts,
      metadata: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };

    // Store in cache
    try {
      await sql`
        INSERT INTO search_cache (cache_key, result, created_at)
        VALUES (${cacheKey}, ${responseData}, NOW())
        ON CONFLICT (cache_key) DO UPDATE SET result = EXCLUDED.result, created_at = NOW()
      `;
    } catch (cacheError) {
      console.warn("Cache insertion failed:", cacheError.message);
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
