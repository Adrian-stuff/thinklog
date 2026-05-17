-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RSS Feeds Table
CREATE TABLE feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  last_fetched TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_id UUID REFERENCES feeds(id),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  author VARCHAR(255),
  url TEXT NOT NULL UNIQUE,
  published_at TIMESTAMP,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reactions Table
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) NOT NULL, -- 'like', 'love', 'insightful'
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Indexes for performance
CREATE INDEX idx_posts_published ON posts(published_at DESC);
CREATE INDEX idx_posts_feed ON posts(feed_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- Enable Row Level Security (RLS) on Tables
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Setup basic policies
-- Everyone can read active feeds and posts
CREATE POLICY "Public reads for active feeds" ON feeds FOR SELECT USING (is_active = true);
CREATE POLICY "Public reads for posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Public reads for comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public reads for reactions" ON reactions FOR SELECT USING (true);

-- Authenticated users can insert comments and reactions
CREATE POLICY "Authenticated users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Adding search_cache for Redis-like caching in PostgreSQL
CREATE UNLOGGED TABLE IF NOT EXISTS search_cache (
  cache_key TEXT PRIMARY KEY,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
