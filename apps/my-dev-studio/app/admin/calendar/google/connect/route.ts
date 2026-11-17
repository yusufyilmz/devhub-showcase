import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { sameOrigin } from "@shared/auth";
import { googleAuthorizationUrl } from "@shared/calendar/google";

import { calendarJson, calendarSession } from "../../_access";
import { googleConfig, googleCookieOptions, oauthCookie } from "../../_google";
import { sealGoogleSession } from "../../_google-session";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return calendarJson({ error: "Invalid origin." }, 403);
  const { user } = await calendarSession();
  if (!user) return calendarJson({ error: "Sign in required." }, 401);
  const config = googleConfig();
  if (!config || config.callback.origin !== new URL(request.url).origin) {
    return calendarJson({ error: "Google Calendar isn’t configured for this address." }, 503);
  }

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const response = NextResponse.redirect(googleAuthorizationUrl(config, state, challenge), 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set(
    oauthCookie,
    sealGoogleSession(config.sessionKey, user.id, "oauth", `${state}.${verifier}`, 600),
    googleCookieOptions(config.callback, 600),
  );
  return response;
}
