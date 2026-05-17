-- Adding search_cache for Redis-like caching in PostgreSQL
CREATE UNLOGGED TABLE IF NOT EXISTS search_cache (
  cache_key TEXT PRIMARY KEY,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
