import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// False when the keys aren't set (e.g. a fresh checkout); accounts are then unavailable.
export const supabaseConfigured = Boolean(url && key);

// Supabase client for Client Components. The signed-in user's session lives in cookies,
// and every query is filtered by the database's Row Level Security rules.
export function createClient() {
  return createBrowserClient(url, key);
}
