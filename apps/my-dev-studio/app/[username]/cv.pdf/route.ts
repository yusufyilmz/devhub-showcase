import {
  readPortfolioAccessStatus,
  readPublicProfileByUsername,
  resolvePublishedUsername,
} from "@shared/services/published-profile";

import { readProtectedProfile } from "@/features/portfolio/access/server-access";
import { cvResponse } from "@/features/portfolio/cv/cv-response";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ username: string }> }) {
  let snapshot = await readPublicProfileByUsername((await context.params).username, "cv");
  if (!snapshot) {
    const gate = await readPortfolioAccessStatus((await context.params).username);
    if (gate) snapshot = await readProtectedProfile(gate.id, "cv");
  }
  if (!snapshot) {
    const alias = await resolvePublishedUsername((await context.params).username);
    if (alias && alias.username !== (await context.params).username)
      return new Response(null, {
        headers: {
          "Cache-Control": "private, no-store",
          Location: new URL(
            `/${encodeURIComponent(alias.username)}/cv.pdf`,
            request.url,
          ).toString(),
        },
        status: 308,
      });
    return new Response("CV not found.", {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    });
  }
  return cvResponse(snapshot);
}
