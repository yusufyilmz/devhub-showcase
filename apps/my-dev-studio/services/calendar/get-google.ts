import { cookies } from "next/headers";

import {
  fetchGoogleItems,
  GoogleAuthorizationError,
  refreshGoogleToken,
} from "@shared/calendar/google";

import { env } from "@/env";
import { openGoogleSession } from "@/services/calendar/get-google-session";

export const calendarPath = "/studio/calendar";
const legacyCalendarCallback = "/admin/calendar/google/callback";
export const googleCookie = "studio_google_calendar";
export const oauthCookie = "studio_google_calendar_oauth";

export function googleConfig() {
  const {
    GOOGLE_CALENDAR_CLIENT_ID: clientId,
    GOOGLE_CALENDAR_CLIENT_SECRET: clientSecret,
    GOOGLE_CALENDAR_REDIRECT_URI: redirectUri,
    GOOGLE_CALENDAR_SESSION_KEY: sessionKey,
  } = env;
  if (!clientId || !clientSecret || !redirectUri || !sessionKey) return null;

  const callback = new URL(redirectUri);
  const local = callback.protocol === "http:" && callback.hostname === "localhost";
  if (
    (!local && callback.protocol !== "https:") ||
    callback.username ||
    callback.password ||
    callback.search ||
    callback.hash ||
    (callback.pathname !== `${calendarPath}/google/callback` &&
      callback.pathname !== legacyCalendarCallback)
  )
    return null;

  return { callback, clientId, clientSecret, redirectUri, sessionKey };
}

export function googleCookieOptions(callback: URL, maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: calendarPath,
    sameSite: "lax" as const,
    secure: callback.protocol === "https:",
  };
}

export async function googleFeed(owner: string, range: Parameters<typeof fetchGoogleItems>[1]) {
  const config = googleConfig();
  if (!config) return { connection: "unavailable" as const, items: [], warnings: [] };
  const cookie = (await cookies()).get(googleCookie)?.value;
  const token = openGoogleSession(config.sessionKey, owner, "connection", cookie);
  if (!token) return { connection: "disconnected" as const, items: [], warnings: [] };
  try {
    const accessToken = await refreshGoogleToken(config, token);
    return { connection: "connected" as const, ...(await fetchGoogleItems(accessToken, range)) };
  } catch (error) {
    if (error instanceof GoogleAuthorizationError) {
      return { connection: "expired" as const, items: [], warnings: [] };
    }
    return {
      connection: "connected" as const,
      items: [],
      warnings: ["Google couldn’t load. Try refreshing the calendar."],
    };
  }
}
