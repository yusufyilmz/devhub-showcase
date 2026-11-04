import { unlockPortfolio } from "@/features/portfolio/access/unlock-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ username: string }> }) {
  return unlockPortfolio(request, (await context.params).username);
}
