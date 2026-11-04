import { readPublicProfile } from "@shared/services/published-profile";

import { readProtectedProfile } from "@/features/portfolio/access/server-access";
import { cvResponse } from "@/features/portfolio/cv/cv-response";

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
