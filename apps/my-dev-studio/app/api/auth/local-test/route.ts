import { createServerClient } from "@shared/lib/supabase";

import { env } from "@/env";
import { requireWorkspace } from "@/features/admin/admin-auth";
import { localTestLoginRequestAllowed } from "@/features/admin/local-test-login";

/** This shortcut uses a real Supabase Auth session, never forged cookies. */
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!localTestLoginRequestAllowed(request)) {
    return Response.json({ error: "Local test login is unavailable." }, { headers, status: 404 });
  }

  const email = env.LOCAL_TEST_EMAIL;
  const password = env.LOCAL_TEST_PASSWORD;
  if (!email || !password) {
    return Response.json(
      { error: "Set LOCAL_TEST_EMAIL and LOCAL_TEST_PASSWORD for the local test user." },
      { headers, status: 503 },
    );
  }

  try {
    const client = await createServerClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      return Response.json(
        { error: "Local test user is not ready. Create it in local Supabase Auth first." },
        { headers, status: 503 },
      );
    }
    try {
      await requireWorkspace(client);
    } catch {
      await client.auth.signOut({ scope: "local" });
      return Response.json(
        { error: "Local test workspace could not be opened." },
        { headers, status: 503 },
      );
    }
    return Response.json({ ok: true }, { headers });
  } catch (reason) {
    const message =
      reason instanceof Error && reason.message === "Supabase is not configured."
        ? "Set the local Supabase URL and publishable key before using the test user."
        : "Local Supabase Auth is unavailable.";
    return Response.json({ error: message }, { headers, status: 503 });
  }
}
