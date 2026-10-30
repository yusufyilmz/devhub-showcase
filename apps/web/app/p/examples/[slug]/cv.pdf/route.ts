import { getPortfolioExample } from "../../../../../features/examples/data";
import { cvResponse } from "../../../../../lib/cv-response";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const item = getPortfolioExample((await context.params).slug);
  if (!item) return new Response("Example not found.", { status: 404 });
  const profile = {
    ...item.profile,
    title: `Fictional example · ${item.profile.title}`,
  };
  const response = await cvResponse({
    id: "example",
    profile,
    revision: 1,
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
