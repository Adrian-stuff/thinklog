const sql = require('./backend/config/db');

async function checkStructure() {
  try {
    console.log("Checking table 'posts'...");
    const postsColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'posts'
      ORDER BY ordinal_position;
    `;
    console.log("Posts Columns:", JSON.stringify(postsColumns, null, 2));

    console.log("\nChecking table 'feeds'...");
    const feedsColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'feeds'
      ORDER BY ordinal_position;
    `;
    console.log("Feeds Columns:", JSON.stringify(feedsColumns, null, 2));

    console.log("\nChecking indices for 'reactions' and 'comments'...");
    const otherIndices = await sql`
      SELECT
          t.relname as table_name,
          i.relname as index_name,
          a.attname as column_name
      FROM
          pg_class t,
          pg_class i,
          pg_index ix,
          pg_attribute a
      WHERE
          t.oid = ix.indrelid
          AND i.oid = ix.indexrelid
          AND a.attrelid = t.oid
          AND a.attnum = ANY(ix.indkey)
          AND t.relkind = 'r'
          AND t.relname IN ('reactions', 'comments');
    `;
    console.log("Other Indices:", JSON.stringify(otherIndices, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkStructure();
