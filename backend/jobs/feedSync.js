const { syncFeeds } = require('../services/rssFetcher');

async function runSync() {
  console.log('Running scheduled feed sync:', new Date().toISOString());
  await syncFeeds();
  
  // Cache TTL cleanup (Redis-like behavior)
  try {
    const sql = require('../config/db');
    await sql`DELETE FROM search_cache WHERE created_at < NOW() - INTERVAL '1 hour'`;
    console.log('Cleaned up stale search cache.');
  } catch (err) {
    console.warn('Cache cleanup skipped (table might not exist yet).');
  }
}

module.exports = { runSync };

