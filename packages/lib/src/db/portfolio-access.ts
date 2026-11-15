import { createClient } from "@supabase/supabase-js";

import { ProfileSetupError } from "../repositories/profile/contract";
import type { Database } from "../types/index";

export function createPortfolioAccessServer({
  url,
  secret,
}: {
  url: string | undefined;
  secret: string | undefined;
}) {
  if (!url || !secret) throw new ProfileSetupError();
  const client = createClient<Database>(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return { client, secret };
}
