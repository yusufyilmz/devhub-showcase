import { portfolioIcon } from "@shared/assistant/portfolio-branding";

import { getUsernameProfile } from "../_profile";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { profile } = await getUsernameProfile((await params).username, "/icon.svg");
  return new Response(portfolioIcon(profile), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "image/svg+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
