import { readPublicProfile } from "@shared/lib/published-profile";

import { cvResponse } from "@/services/cv/get-response";
import { readProtectedProfile } from "@/services/portfolio/get-access-session";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const id = (await context.params).id;
  const snapshot = (await readPublicProfile(id, "cv")) ?? (await readProtectedProfile(id, "cv"));
  if (!snapshot)
    return new Response("CV not found.", {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    });
  return cvResponse(snapshot);
}
