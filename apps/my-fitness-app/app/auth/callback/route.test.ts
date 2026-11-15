import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}));
const bearer = vi.hoisted(() => ({
  getUser: vi.fn(),
}));
vi.mock("@shared/auth/server", () => ({
  createClient: async () => ({ auth }),
  createRequestClient: () => ({ auth: bearer }),
}));

import { requestIdentity } from "../../../lib/auth";
import { POST } from "../../api/auth/session/route";
import { GET } from "./route";

const owner = "00000000-0000-4000-8000-000000000001";

describe("Fitness auth", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-key");
    vi.stubEnv("APP_URL", "https://fitness.example");
    auth.getUser.mockResolvedValue({
      data: { user: { email_confirmed_at: "today", id: owner } },
      error: null,
    });
    auth.signInWithPassword.mockResolvedValue({ error: null });
    auth.signOut.mockResolvedValue({ error: null });
    auth.exchangeCodeForSession.mockResolvedValue({ error: null });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("only accepts user identity returned by Supabase token verification", async () => {
    bearer.getUser.mockResolvedValue({
      data: { user: { id: owner } },
      error: null,
    });
    const result = await requestIdentity(
      new Request("https://fitness.example", {
        headers: { Authorization: "Bearer real-token" },
      }),
    );
    expect(bearer.getUser).toHaveBeenCalledExactlyOnceWith("real-token");
    expect(auth.getUser).not.toHaveBeenCalled();
    expect(result.user?.id).toBe(owner);
    bearer.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("invalid token"),
    });
    expect(
      (
        await requestIdentity(
          new Request("https://fitness.example", {
            headers: { Authorization: "Bearer forged-owner-token" },
          }),
        )
      ).user,
    ).toBeNull();
  });

  it("reads the shared cookie session when the request has no bearer token", async () => {
    const result = await requestIdentity(new Request("https://fitness.example"));
    expect(auth.getUser).toHaveBeenCalledOnce();
    expect(bearer.getUser).not.toHaveBeenCalled();
    expect(result.user?.id).toBe(owner);
  });

  it("keeps an anonymous request anonymous when the cookie has no user", async () => {
    auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect((await requestIdentity(new Request("https://fitness.example"))).user).toBeNull();
    expect(bearer.getUser).not.toHaveBeenCalled();
  });

  it("owner login stores the session in the shared cookie and does not return tokens", async () => {
    const response = await POST(
      new Request("https://fitness.example/api/auth/session", {
        body: JSON.stringify({
          email: "owner@example.com",
          password: "private-password",
        }),
        headers: { origin: "https://fitness.example" },
        method: "POST",
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true });
    expect(JSON.stringify(body)).not.toContain("private-password");
    expect(body.session).toBeUndefined();
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("keeps a confirmed non-owner session so a studio login is not cleared", async () => {
    auth.getUser.mockResolvedValue({
      data: { user: { email_confirmed_at: "today", id: "another-user" } },
      error: null,
    });
    const response = await POST(
      new Request("https://fitness.example/api/auth/session", {
        body: JSON.stringify({
          email: "other@example.com",
          password: "private-password",
        }),
        headers: { origin: "https://fitness.example" },
        method: "POST",
      }),
    );
    expect(response.status).toBe(200);
    expect(auth.signOut).not.toHaveBeenCalled();
  });

  it("sends Google back to this app and ignores a requested redirect", async () => {
    const response = await GET(
      new Request("https://fitness.example/auth/callback?code=valid-code&next=//evil.example", {
        headers: { "x-forwarded-host": "evil.example" },
      }),
    );
    expect(auth.exchangeCodeForSession).toHaveBeenCalledWith("valid-code");
    expect(response.headers.get("location")).toBe("https://fitness.example/");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});

// Keep per-test configuration mutable; production schemas are validated separately.
vi.mock("../../../env", () => ({ env: process.env }));
