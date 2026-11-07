import { NextResponse } from "next/server";

import { ZodError, z } from "zod";

import { readPortfolioAccessStatus } from "@shared/services/published-profile";

import { env } from "@/env";
import { sameOrigin } from "@/features/admin/admin-auth";

import {
  accessAttemptBucket,
  issuePortfolioGrant,
  portfolioGrantCookie,
  verifyPortfolioPassword,
} from "./password";
import { passwordRecordSchema, portfolioAccessServer } from "./server-access";

const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
const inputSchema = z.object({ password: z.string().min(1).max(128) }).strict();
const denied = () =>
  Response.json({ error: "Could not unlock this portfolio." }, { headers, status: 403 });

export async function unlockPortfolio(request: Request, username: string) {
  if (!sameOrigin(request)) return denied();
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 1024)
      return Response.json({ error: "Request too large." }, { headers, status: 413 });
    const { password } = inputSchema.parse(JSON.parse(raw));
    const gate = await readPortfolioAccessStatus(username);
    if (!gate) return denied();
    const { client, secret } = portfolioAccessServer();
    // Forwarded addresses are only a best-effort per-visitor bucket. The database
    // also enforces a global ceiling, independent of supplied proxy headers.
    const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const reserved = await client.rpc("reserve_portfolio_access_attempt", {
      request_bucket: accessAttemptBucket(gate.id, address, secret),
    });
    if (reserved.error) throw new Error("storage");
    if (reserved.data !== true)
      return Response.json(
        { error: "Too many attempts. Try again later." },
        {
          headers: { ...headers, "Retry-After": "300" },
          status: 429,
        },
      );
    const record = await client.rpc("portfolio_password_record", { profile_id: gate.id });
    if (record.error) throw new Error("storage");
    if (!record.data) return denied();
    const parsed = passwordRecordSchema.safeParse(record.data);
    if (!parsed.success) throw new Error("storage");
    const credential = parsed.data;
    if (!(await verifyPortfolioPassword(password, credential.password_digest))) return denied();
    const response = NextResponse.json({ unlocked: true }, { headers });
    response.cookies.set(
      portfolioGrantCookie(gate.id),
      issuePortfolioGrant(gate.id, credential.access_version, secret),
      {
        httpOnly: true,
        maxAge: 3600,
        path: "/",
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
      },
    );
    return response;
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof ZodError)
      return Response.json({ error: "Invalid password request." }, { headers, status: 400 });
    return Response.json(
      { error: "Portfolio access is temporarily unavailable." },
      { headers, status: 503 },
    );
  }
}
