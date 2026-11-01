import { createClient } from "@supabase/supabase-js";

import { supabaseConfig } from "./config";
/** Stateless server client. Never persists sessions or shares one user's token with another request. */
export function createSupabaseRequestClient(token?: string) {
  const { url, key } = supabaseConfig();
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}
