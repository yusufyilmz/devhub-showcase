import { afterEach, describe, expect, it, vi } from "vitest";

import {
  exchangeGoogleCode,
  fetchGoogleItems,
  GoogleAuthorizationError,
  googleAuthorizationUrl,
  refreshGoogleToken,
  revokeGoogleToken,
} from "./google";

const config = {
  clientId: "example-client",
  clientSecret: "example-secret",
  redirectUri: "https://studio.example.test/calendar/callback",
};

const range = { from: "2026-03-07", timeZone: "America/Los_Angeles", to: "2026-03-10" };

function mockFetch(respond: (url: URL, init?: RequestInit) => Response | Promise<Response>) {
  const fetch = vi.fn((url: URL | string, init?: RequestInit) =>
    Promise.resolve(respond(new URL(url), init)),
  );
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

describe("Google calendar provider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests offline consent using PKCE and only read-only scopes", () => {
    const url = googleAuthorizationUrl(config, "opaque state", "pkce-challenge");

    expect(url.origin + url.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      access_type: "offline",
      client_id: config.clientId,
      code_challenge: "pkce-challenge",
      code_challenge_method: "S256",
      prompt: "consent",
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope:
        "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly",
      state: "opaque state",
    });
  });

  it("exchanges, refreshes, and revokes credentials using form POST bodies", async () => {
    const fetch = mockFetch((url, init) => {
      expect(url.origin).toBe("https://oauth2.googleapis.com");
      expect(url.search).toBe("");
      expect(init).toMatchObject({ cache: "no-store", method: "POST", redirect: "error" });
      expect(init?.body).toBeInstanceOf(URLSearchParams);
      if (url.pathname === "/revoke") return new Response(null, { status: 200 });
      return Response.json({ access_token: "access", refresh_token: "refresh" });
    });

    await expect(exchangeGoogleCode(config, "code", "verifier")).resolves.toBe("refresh");
    await expect(refreshGoogleToken(config, "refresh")).resolves.toBe("access");
    await expect(revokeGoogleToken("refresh")).resolves.toBeUndefined();

    const bodies = fetch.mock.calls.map(([, init]) =>
      Object.fromEntries(init?.body as URLSearchParams),
    );
    expect(bodies).toEqual([
      {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: "code",
        code_verifier: "verifier",
        grant_type: "authorization_code",
        redirect_uri: config.redirectUri,
      },
      {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "refresh_token",
        refresh_token: "refresh",
      },
      { token: "refresh" },
    ]);
  });

  it("distinguishes invalid grants and missing refresh tokens from transient failures", async () => {
    const fetch = mockFetch(() => Response.json({ access_token: "access" }));
    fetch.mockResolvedValueOnce(
      Response.json(
        { error: "invalid_grant", error_description: "private details" },
        { status: 400 },
      ),
    );
    await expect(refreshGoogleToken(config, "refresh")).rejects.toBeInstanceOf(
      GoogleAuthorizationError,
    );
    await expect(exchangeGoogleCode(config, "code", "verifier")).rejects.toBeInstanceOf(
      GoogleAuthorizationError,
    );
    fetch.mockResolvedValueOnce(Response.json({ error: "invalid_grant" }, { status: 503 }));
    await expect(refreshGoogleToken(config, "refresh")).rejects.not.toBeInstanceOf(
      GoogleAuthorizationError,
    );
    fetch.mockRejectedValueOnce(new Error("private details"));
    await expect(refreshGoogleToken(config, "refresh")).rejects.toThrow("Could not reach Google.");
  });

  it("accepts a partial read grant and rejects a token without either requested scope", async () => {
    const fetch = mockFetch(() =>
      Response.json({
        access_token: "access",
        refresh_token: "refresh",
        scope: "https://www.googleapis.com/auth/tasks.readonly",
      }),
    );
    await expect(exchangeGoogleCode(config, "code", "verifier")).resolves.toBe("refresh");
    await expect(refreshGoogleToken(config, "refresh")).resolves.toBe("access");

    fetch.mockResolvedValueOnce(Response.json({ access_token: "access", scope: "openid email" }));
    await expect(refreshGoogleToken(config, "refresh")).rejects.toBeInstanceOf(
      GoogleAuthorizationError,
    );
  });

  it("uses local dates for timed instances and preserves and clips all-day spans", async () => {
    const href = "https://calendar.google.com/calendar/event?eid=sample";
    const fetch = mockFetch((url, init) => {
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer access");
      if (url.pathname === "/tasks/v1/users/@me/lists") return Response.json({});
      if (url.pathname === "/calendar/v3/users/me/calendarList") {
        return Response.json({ items: [{ id: "work@example.test", summaryOverride: "Work" }] });
      }

      expect(url.pathname).toBe("/calendar/v3/calendars/work%40example.test/events");
      expect(Object.fromEntries(url.searchParams)).toMatchObject({
        singleEvents: "true",
        timeMax: "2026-03-11T00:00:00.000Z",
        timeMin: "2026-03-06T00:00:00.000Z",
        timeZone: range.timeZone,
      });
      return Response.json({
        items: [
          {
            end: { date: "2026-03-09" },
            htmlLink: href,
            id: "days",
            start: { date: "2026-03-06" },
            summary: "Conference",
          },
          {
            end: { dateTime: "2026-03-08T08:00:00Z" },
            id: "instance-1",
            recurringEventId: "series",
            start: { dateTime: "2026-03-08T07:30:00Z" },
            summary: "Overnight",
          },
          {
            htmlLink: "https://calendar.google.com.evil.test/calendar/event?eid=sample",
            id: "instance-2",
            recurringEventId: "series",
            start: { dateTime: "2026-03-09T07:30:00Z" },
            summary: "Next instance",
          },
          {
            id: "offsetless",
            start: { dateTime: "2026-03-08T17:00:00", timeZone: "Europe/Paris" },
            summary: "Paris call",
          },
          {
            id: "outside",
            start: { dateTime: "2026-03-10T07:00:00Z" },
          },
          { id: "cancelled", start: { date: "2026-03-08" }, status: "cancelled" },
        ],
      });
    });

    const { items, warnings } = await fetchGoogleItems("access", range);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(warnings).toEqual([]);
    expect(items).toHaveLength(5);
    expect(items.filter(({ title }) => title === "Conference")).toEqual([
      {
        date: "2026-03-07",
        href,
        id: expect.any(String),
        source: "google-calendar",
        sourceLabel: "Work",
        title: "Conference",
        type: "event",
      },
      {
        date: "2026-03-08",
        href,
        id: expect.any(String),
        source: "google-calendar",
        sourceLabel: "Work",
        title: "Conference",
        type: "event",
      },
    ]);
    expect(items.find(({ title }) => title === "Overnight")).toMatchObject({
      date: "2026-03-07",
      time: "23:30",
    });
    const nextInstance = items.find(({ title }) => title === "Next instance");
    expect(nextInstance).toMatchObject({ date: "2026-03-09", time: "00:30" });
    expect(nextInstance?.href).toBeUndefined();
    expect(items.find(({ title }) => title === "Paris call")).toMatchObject({
      date: "2026-03-08",
      time: "09:00",
    });
    expect(new Set(items.map(({ id }) => id)).size).toBe(items.length);
  });

  it("preserves task due dates, completed status, and list identity across pages", async () => {
    const href = "https://tasks.google.com/embed/?action=sample";
    mockFetch((url) => {
      const page = url.searchParams.get("pageToken");
      if (url.pathname === "/calendar/v3/users/me/calendarList") return Response.json({});
      if (url.pathname === "/tasks/v1/users/@me/lists") {
        return page
          ? Response.json({ items: [{ id: "home", title: "Home" }] })
          : Response.json({
              items: [{ id: "work", title: "Work" }],
              nextPageToken: "list-second",
            });
      }
      expect(Object.fromEntries(url.searchParams)).toMatchObject({
        dueMax: "2026-03-10T00:00:00Z",
        dueMin: "2026-03-07T00:00:00Z",
        showCompleted: "true",
        showHidden: "true",
      });
      if (url.pathname === "/tasks/v1/lists/work/tasks" && !page) {
        return Response.json({ items: [], nextPageToken: "task-second" });
      }
      return Response.json({
        items: [
          {
            due: "2026-03-07T00:00:00.000Z",
            id: "shared-id",
            notes: "Three sections",
            status: "completed",
            title: "Finish notes",
            webViewLink: href,
          },
          { id: "undated", title: "Backlog" },
          { due: "2026-03-10T00:00:00Z", id: "outside" },
          { deleted: true, due: "2026-03-09T00:00:00Z", id: "deleted" },
        ],
      });
    });

    const { items, warnings } = await fetchGoogleItems("access", range);
    expect(warnings).toEqual([]);
    expect(items.map(({ sourceLabel }) => sourceLabel)).toEqual(["Work", "Home"]);
    expect(items[0]).toEqual({
      completed: true,
      date: "2026-03-07",
      description: "Three sections",
      href,
      id: expect.any(String),
      source: "google-tasks",
      sourceLabel: "Work",
      title: "Finish notes",
      type: "task",
    });
    expect(items[0]?.id).not.toBe(items[1]?.id);
  });

  it("keeps earlier pages and other calendars when a later page fails", async () => {
    mockFetch((url) => {
      const page = url.searchParams.get("pageToken");
      if (url.pathname === "/tasks/v1/users/@me/lists") {
        return Response.json({ error: { message: "private list details" } }, { status: 403 });
      }
      if (url.pathname === "/calendar/v3/users/me/calendarList") {
        return page
          ? Response.json({ items: [{ id: "home" }] })
          : Response.json({ items: [{ id: "work" }], nextPageToken: "next-list" });
      }
      if (page) return Response.json({}, { status: 503 });
      return Response.json({
        items: [{ id: "event", start: { date: "2026-03-08" }, summary: url.pathname }],
        ...(url.pathname.includes("/work/") && { nextPageToken: "next-event" }),
      });
    });

    const { items, warnings } = await fetchGoogleItems("access", range);
    expect(items).toHaveLength(2);
    expect(items[0]?.id).not.toBe(items[1]?.id);
    expect(warnings).toEqual([
      "Some Google Calendar events could not be loaded.",
      "Google Tasks lists could not be loaded.",
    ]);
  });

  it("bounds pagination and reports truncated results", async () => {
    const fetch = mockFetch((url) => {
      if (url.pathname === "/calendar/v3/users/me/calendarList") {
        return Response.json({ items: [{ id: "work" }] });
      }
      if (url.pathname === "/tasks/v1/users/@me/lists") return Response.json({});
      const page = Number(url.searchParams.get("pageToken") ?? "0");
      return Response.json({
        items: [{ id: String(page), start: { date: "2026-03-08" } }],
        nextPageToken: String(page + 1),
      });
    });
    const { items, warnings } = await fetchGoogleItems("access", range);
    expect(items).toHaveLength(5);
    expect(fetch).toHaveBeenCalledTimes(7);
    expect(warnings).toEqual(["Some Google Calendar events were omitted because of a limit."]);
  });

  it("signals an expired or rejected bearer token to the caller", async () => {
    mockFetch(() => Response.json({}, { status: 401 }));
    await expect(fetchGoogleItems("access", range)).rejects.toBeInstanceOf(
      GoogleAuthorizationError,
    );
  });

  it("keeps results when only one service lacks consent", async () => {
    const fetch = mockFetch((url) => {
      if (url.pathname === "/calendar/v3/users/me/calendarList") {
        return Response.json({ items: [{ id: "work" }] });
      }
      if (url.pathname === "/calendar/v3/calendars/work/events") {
        return Response.json({
          items: [{ id: "event", start: { date: "2026-03-08" }, summary: "Planning" }],
        });
      }
      return Response.json(
        { error: { details: [{ reason: "ACCESS_TOKEN_SCOPE_INSUFFICIENT" }] } },
        { status: 403 },
      );
    });

    await expect(fetchGoogleItems("access", range)).resolves.toMatchObject({
      items: [{ title: "Planning" }],
      warnings: ["Reconnect Google to grant access to Google Tasks."],
    });

    fetch.mockImplementation(
      async () =>
        new Response(null, {
          headers: { "WWW-Authenticate": 'Bearer error="insufficient_scope"' },
          status: 403,
        }),
    );
    await expect(fetchGoogleItems("access", range)).rejects.toBeInstanceOf(
      GoogleAuthorizationError,
    );
  });
});
