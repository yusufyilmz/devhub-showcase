import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { exchangeGoogleCode } from "@shared/calendar/google";

import { calendarJson, calendarSession } from "../../_access";
import {
  calendarPath,
  googleConfig,
  googleCookie,
  googleCookieOptions,
  oauthCookie,
} from "../../_google";
import { openGoogleSession, sealGoogleSession } from "../../_google-session";

const connectionTtl = 90 * 24 * 60 * 60;

export async function GET(request: Request) {
  const config = googleConfig();
  const url = new URL(request.url);
  if (!config || config.callback.origin !== url.origin) {
    return calendarJson({ error: "Google Calendar isn’t configured for this address." }, 503);
  }
  const { user } = await calendarSession();
  const cookie = (await cookies()).get(oauthCookie)?.value;
  const attempt = user && openGoogleSession(config.sessionKey, user.id, "oauth", cookie);
  const [state, verifier] = attempt ? attempt.split(".") : [];
  const code = url.searchParams.get("code");
  const valid = state && state === url.searchParams.get("state") && verifier && user;
  const destination = new URL(user ? calendarPath : "/login", url.origin);
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set(oauthCookie, "", googleCookieOptions(config.callback, 0));
  if (!user) return response;

  let result = "failed";
  if (valid && code && !url.searchParams.has("error")) {
    try {
      const token = await exchangeGoogleCode(config, code, verifier);
      response.cookies.set(
        googleCookie,
        sealGoogleSession(config.sessionKey, user.id, "connection", token, connectionTtl),
        googleCookieOptions(config.callback, connectionTtl),
      );
      result = "connected";
    } catch {
      // Keep an earlier connection when replacing it fails.
    }
  } else if (valid && url.searchParams.get("error") === "access_denied") {
    result = "denied";
  }

  destination.searchParams.set("google", result);
  response.headers.set("Location", destination.href);
  return response;
}
