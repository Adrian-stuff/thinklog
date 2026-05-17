require('dotenv').config();
const sql = require('./backend/config/db');

async function test() {
  try {
    const res = await sql`SELECT 1`;
    console.log("DB connected:", res);
  } catch (err) {
    console.error("DB error:", err);
  } finally {
    process.exit(0);
  }
}
test();
