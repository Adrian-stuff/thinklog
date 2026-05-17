// Initialize Supabase Client for the frontend
const SUPABASE_URL = 'https://umlfetbowbafiigwzdre.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbGZldGJvd2JhZmlpZ3d6ZHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Njk1ODQsImV4cCI6MjA5MzU0NTU4NH0.fJCDLdhzXsYt77Sr6EKZzx1GKgLZ48tTujYexVUJu_8';

// Initialize client without redeclaring 'supabase' globally conflicting with CDN
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
