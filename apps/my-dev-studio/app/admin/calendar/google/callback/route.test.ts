import { describe, expect, it, vi } from "vitest";

import { exchangeGoogleCode } from "@shared/calendar/google";

import { openGoogleSession } from "../../_google-session";
import { POST as connect } from "../connect/route";
import { GET as callback } from "./route";

const fixture = vi.hoisted(() => ({
  attempt: "",
  key: "1".repeat(64),
  owner: "fixture-calendar-owner",
  site: "http://localhost:3001",
}));

vi.mock("@/env", () => ({
  env: {
    GOOGLE_CALENDAR_CLIENT_ID: "calendar-client",
    GOOGLE_CALENDAR_CLIENT_SECRET: "fixture-secret",
    GOOGLE_CALENDAR_REDIRECT_URI: `${fixture.site}/admin/calendar/google/callback`,
    GOOGLE_CALENDAR_SESSION_KEY: fixture.key,
  },
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: fixture.attempt }) }),
}));
vi.mock("../../_access", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../_access")>()),
  calendarSession: async () => ({ user: { id: fixture.owner } }),
}));
vi.mock("@shared/calendar/google", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@shared/calendar/google")>()),
  exchangeGoogleCode: vi.fn().mockResolvedValue("fixture-refresh-token"),
}));

async function startConnection() {
  const response = await connect(
    new Request(`${fixture.site}/admin/calendar/google/connect`, {
      headers: { origin: fixture.site },
      method: "POST",
    }),
  );
  const destination = new URL(response.headers.get("location") ?? "");
  const state = destination.searchParams.get("state");
  const attempt = response.cookies.get("studio_google_calendar_oauth")?.value;
  if (!state || !attempt) throw new Error("Missing OAuth attempt");
  fixture.attempt = attempt;
  return { destination, state };
}

function callbackRequest(state: string) {
  const url = new URL("/admin/calendar/google/callback", fixture.site);
  url.searchParams.set("state", state);
  url.searchParams.set("code", "fixture-code");
  return new Request(url);
}

describe("Studio Google Calendar OAuth", () => {
  it("connects a signed-in owner through a state-bound PKCE callback", async () => {
    const { destination, state } = await startConnection();
    expect(destination.origin).toBe("https://accounts.google.com");
    expect(destination.searchParams.get("code_challenge_method")).toBe("S256");
    const response = await callback(callbackRequest(state));
    expect(response.headers.get("location")).toBe(
      `${fixture.site}/admin/calendar?google=connected`,
    );
    expect(response.cookies.get("studio_google_calendar_oauth")?.maxAge).toBe(0);
    const cookie = response.cookies.get("studio_google_calendar");
    expect(cookie?.httpOnly).toBe(true);
    expect(openGoogleSession(fixture.key, fixture.owner, "connection", cookie?.value)).toBe(
      "fixture-refresh-token",
    );
  });

  it("rejects a mismatched state before contacting Google", async () => {
    const { state } = await startConnection();
    vi.mocked(exchangeGoogleCode).mockClear();
    const response = await callback(callbackRequest(`${state}-changed`));
    expect(response.headers.get("location")).toBe(`${fixture.site}/admin/calendar?google=failed`);
    expect(response.cookies.get("studio_google_calendar")).toBeUndefined();
    expect(exchangeGoogleCode).not.toHaveBeenCalled();
  });

  it("rejects cross-origin connection requests", async () => {
    const response = await connect(
      new Request(`${fixture.site}/admin/calendar/google/connect`, {
        headers: { origin: "https://foreign.example.test" },
        method: "POST",
      }),
    );
    expect(response.status).toBe(403);
  });
});
