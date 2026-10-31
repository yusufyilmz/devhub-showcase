import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
export function billingServiceClient() {
  return createClient(
    z.url().parse(process.env.NEXT_PUBLIC_SUPABASE_URL),
    z.string().min(20).parse(process.env.SUPABASE_SERVICE_ROLE_KEY),
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    },
  );
}
