import { NextResponse } from "next/server";

import { z } from "zod";

import { configured, sameOrigin, workspaceOwnerId } from "@/lib/auth";
import { createSupabaseRequestClient } from "@/lib/supabase/server";

const credentials = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
});
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  if (!configured() || !process.env.WORKSPACE_OWNER_ID)
    return NextResponse.json(
      { error: "Configure your Supabase project and workspace owner first." },
      { status: 503 },
    );
  const input = credentials.safeParse(await request.json().catch(() => null));
  if (!input.success)
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  const ownerId = workspaceOwnerId();
  const client = createSupabaseRequestClient();
  const { data, error } = await client.auth.signInWithPassword(input.data);
  if (error || !data.session || !data.user)
    return NextResponse.json(
      {
        error:
          error?.status === 429
            ? "Too many attempts. Try again later."
            : "Could not sign in. Check your email and password.",
      },
      { status: error?.status === 429 ? 429 : 401 },
    );
  if (data.user.id !== ownerId) {
    await client.auth.signOut({ scope: "local" });
    return NextResponse.json(
      {
        error: "This account is not the workspace owner. You can still view the shared workspace.",
      },
      { status: 403 },
    );
  }
  return NextResponse.json(
    {
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
