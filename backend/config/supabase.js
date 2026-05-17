const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use Service Key if available, otherwise fallback to Anon Key for basic auth verification
const supabaseKey = process.env.SUPABASE_SERVICE_KEY !== 'your_supabase_service_role_key' 
  ? process.env.SUPABASE_SERVICE_KEY 
  : process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key not found in environment variables.");
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

module.exports = supabase;
