import { ZodError } from "zod";

import { validateProfile } from "@shared/lib/profiles";
import { ProfileAccessError } from "@shared/services/profile";

import { requireWorkspace } from "@/features/admin/admin-auth";

const headers = { "Cache-Control": "private, no-store" };
export async function GET(request: Request) {
  try {
    const { client, repository } = await requireWorkspace();
    const snapshot = await repository.read();
    if (!snapshot?.id)
      return Response.json({ error: "Profile unavailable." }, { headers, status: 404 });
    const requested = new URL(request.url).searchParams.get("revision");
    if (requested === null) {
      const result = await client
        .from("portfolio_profile_history")
        .select("revision,created_at")
        .eq("profile_id", snapshot.id)
        .order("revision", { ascending: false })
        .limit(20);
      if (result.error) throw new Error("storage");
      return Response.json(
        {
          currentRevision: snapshot.revision,
          retention: { count: 20, days: 90 },
          revisions: result.data ?? [],
        },
        { headers },
      );
    }
    if (!/^\d+$/.test(requested) || !Number.isSafeInteger(Number(requested)))
      return Response.json({ error: "Invalid revision." }, { headers, status: 400 });
    const result = await client
      .from("portfolio_profile_history")
      .select("revision,document,created_at")
      .eq("profile_id", snapshot.id)
      .eq("revision", Number(requested))
      .maybeSingle();
    if (result.error) throw new Error("storage");
    if (!result.data)
      return Response.json({ error: "Revision missing or expired." }, { headers, status: 404 });
    return Response.json(
      {
        createdAt: result.data.created_at,
        currentRevision: snapshot.revision,
        profile: validateProfile(result.data.document),
        revision: result.data.revision,
      },
      { headers },
    );
  } catch (error) {
    if (error instanceof ProfileAccessError)
      return Response.json(
        { error: "Sign in to inspect your saved revisions." },
        { headers, status: 403 },
      );
    if (error instanceof ZodError)
      return Response.json(
        { error: "This revision is incompatible with the current editor." },
        { headers, status: 409 },
      );
    return Response.json(
      { error: "Revision storage is unavailable. Your draft is unchanged." },
      { headers, status: 503 },
    );
  }
}
