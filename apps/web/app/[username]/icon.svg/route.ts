import { portfolioIcon } from "../../../lib/portfolio-branding";
import { getUsernameProfile } from "../../../lib/public-profile";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { profile } = await getUsernameProfile((await params).username);
  return new Response(portfolioIcon(profile), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
