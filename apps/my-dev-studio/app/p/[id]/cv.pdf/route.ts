import { readPublicProfile } from "@shared/services/published-profile";

import { cvResponse } from "@/features/portfolio/cv/cv-response";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const snapshot = await readPublicProfile((await context.params).id, "cv");
  if (!snapshot)
    return new Response("CV not found.", {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    });
  return cvResponse(snapshot);
}
