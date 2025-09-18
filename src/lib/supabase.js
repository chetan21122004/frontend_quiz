// Note: This file is kept for potential future use but Supabase is not used directly in the frontend
// All database operations go through the Express backend API

// The frontend communicates exclusively with the Express backend
// which handles all Supabase interactions internally

console.info('Frontend configured to use Express backend API only - no direct Supabase connection');

// Placeholder exports for compatibility
export const supabase = null;
export const isSupabaseConfigured = () => false;
