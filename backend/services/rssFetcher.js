const sql = require('../config/db');
const { parseFeed } = require('./feedParser');

const extractImage = (item) => {
  if (item['media:content'] && item['media:content']['$'] && item['media:content']['$']['url']) {
    return item['media:content']['$']['url'];
  }
  if (item['media:thumbnail'] && item['media:thumbnail']['$'] && item['media:thumbnail']['$']['url']) {
    return item['media:thumbnail']['$']['url'];
  }
  
  const content = item['content:encoded'] || item.content || item.description || '';
  const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["']/g;
  const match = imgRegex.exec(content);
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
};

const extractExcerpt = (item) => {
  const content = item.contentSnippet || item.description || '';
  return content.substring(0, 250).replace(/<[^>]*>?/gm, '') + (content.length > 250 ? '...' : '');
};

const syncFeeds = async () => {
  console.log('Starting RSS feed synchronization via Direct SQL...');
  try {
    // 1. Get active feeds
    const feeds = await sql`SELECT * FROM feeds WHERE is_active = true`;

    if (!feeds || feeds.length === 0) {
      console.log('No active feeds found.');
      return;
    }

    // 2. Fetch and parse each feed
    for (const feed of feeds) {
      console.log(`Fetching: ${feed.name} (${feed.url})`);
      const parsedData = await parseFeed(feed.url);
      
      if (!parsedData || !parsedData.items) {
        console.warn(`Skipping ${feed.name} due to parse error.`);
        continue;
      }

      let newPostsCount = 0;

      for (const item of parsedData.items) {
        const postUrl = item.link;
        
        // Check if exists
        const [existing] = await sql`SELECT id FROM posts WHERE url = ${postUrl}`;
        if (existing) continue;

        const pubDate = new Date(item.pubDate || item.isoDate || Date.now());
        
        try {
          await sql`
            INSERT INTO posts (
              feed_id, title, content, excerpt, author, url, published_at, image_url, tags
            ) VALUES (
              ${feed.id}, ${item.title || 'Untitled'}, ${item['content:encoded'] || item.content || item.description || ''}, 
              ${extractExcerpt(item)}, ${item.creator || item.author || feed.name}, ${postUrl}, 
              ${pubDate.toISOString()}, ${extractImage(item)}, ${item.categories || []}
            )
          `;
          newPostsCount++;
        } catch (insertError) {
          console.error(`Error inserting post ${item.title}:`, insertError.message);
        }
      }

      // Update last fetched
      await sql`UPDATE feeds SET last_fetched = NOW() WHERE id = ${feed.id}`;
      console.log(`Synced ${feed.name}: Added ${newPostsCount} new posts.`);
    }
    
    console.log('RSS feed synchronization completed.');
  } catch (error) {
    console.error('Error during feed synchronization:', error);
  }
};

module.exports = { syncFeeds };
