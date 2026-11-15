import { timingSafeEqual } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@shared/lib/types";

import { env } from "@/env";

const headers = { "Cache-Control": "private, no-store" };
export async function GET(request: Request) {
  const secret = env.CRON_SECRET;
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (
    !secret ||
    secret.length < 32 ||
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  )
    return Response.json({ error: "Access denied." }, { headers, status: 403 });
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    return Response.json({ error: "Scheduler unavailable." }, { headers, status: 503 });
  try {
    const client = createClient<Database>(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await client.rpc("execute_portfolio_schedules");
    if (error) throw new Error("storage");
    return Response.json({ completed: data }, { headers });
  } catch {
    return Response.json(
      { error: "Scheduler unavailable. Retry safely." },
      { headers, status: 503 },
    );
  }
}
