import { NextResponse } from "next/server";

import { issuePortfolioGrant, portfolioGrantCookie } from "@shared/lib/portfolio-password";
import { createPortfolioUnlock } from "@shared/lib/portfolio-unlock";

import { env } from "@/env";
import { sameOrigin } from "@/features/admin/admin-auth";

import { portfolioAccessServer } from "../../../[username]/access/_session";

const unlockPortfolio = createPortfolioUnlock({
  portfolioAccessServer,
  sameOrigin,
  unlockedResponse(id, version, secret) {
    const response = NextResponse.json(
      { unlocked: true },
      { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } },
    );
    response.cookies.set(portfolioGrantCookie(id), issuePortfolioGrant(id, version, secret), {
      httpOnly: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    });
    return response;
  },
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ username: string }> }) {
  return unlockPortfolio(request, (await context.params).username);
}
