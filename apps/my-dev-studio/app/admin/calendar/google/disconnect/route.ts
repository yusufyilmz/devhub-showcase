import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sameOrigin } from "@shared/auth";
import { revokeGoogleToken } from "@shared/calendar/google";

import { calendarJson, calendarSession } from "../../_access";
import {
  calendarPath,
  googleConfig,
  googleCookie,
  googleCookieOptions,
  oauthCookie,
} from "../../_google";
import { openGoogleSession } from "../../_google-session";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return calendarJson({ error: "Invalid origin." }, 403);
  const { user } = await calendarSession();
  if (!user) return calendarJson({ error: "Sign in required." }, 401);

  const url = new URL(request.url);
  const config = googleConfig();
  const cookie = (await cookies()).get(googleCookie)?.value;
  const token = config && openGoogleSession(config.sessionKey, user.id, "connection", cookie);
  const revoked = token
    ? await revokeGoogleToken(token).then(
        () => true,
        () => false,
      )
    : true;

  const destination = new URL(calendarPath, url.origin);
  destination.searchParams.set("google", revoked ? "disconnected" : "removed");
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set(googleCookie, "", googleCookieOptions(url, 0));
  response.cookies.set(oauthCookie, "", googleCookieOptions(url, 0));
  return response;
}
