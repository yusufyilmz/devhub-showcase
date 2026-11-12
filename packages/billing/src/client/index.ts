import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { env } from "@shared/env";

export function billingServiceClient() {
  return createClient(
    z.url().parse(env.NEXT_PUBLIC_SUPABASE_URL),
    z.string().min(20).parse(env.SUPABASE_SERVICE_ROLE_KEY),
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    },
  );
}
