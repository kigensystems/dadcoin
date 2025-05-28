import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable session persistence
    autoRefreshToken: true, // Enable automatic token refresh
    detectSessionInUrl: true // Enable session detection in URL
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'dadcoin' // Add application identifier
    }
  }
});