import { createClient } from "@supabase/supabase-js";

import { ProfileSetupError } from "../repositories/profile/contract";
import type { Database } from "../types/index";

export function discoveryClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url && !key) return null;
  if (!url || !key) throw new ProfileSetupError();
  const client = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  return client;
}
