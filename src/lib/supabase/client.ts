import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Demo mode: only enabled when Supabase is NOT configured AND explicitly allowed
// In production (Supabase configured), demo mode is always disabled
export const isDemoModeEnabled =
  !isSupabaseConfigured && process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function createSupabaseBrowser() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
