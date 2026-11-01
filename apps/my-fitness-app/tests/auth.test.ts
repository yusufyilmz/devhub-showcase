import { afterEach, beforeEach, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("../lib/supabase/server", () => ({
  createSupabaseRequestClient: () => ({ auth }),
}));

import { POST } from "../app/api/session/route";
import { requestIdentity } from "../lib/auth";

const owner = "00000000-0000-4000-8000-000000000001";
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-key");
  vi.stubEnv("WORKSPACE_OWNER_ID", owner);
  vi.stubEnv("APP_URL", "https://fitness.example");
});
afterEach(() => vi.unstubAllEnvs());
it("only accepts user identity returned by Supabase token verification", async () => {
  auth.getUser.mockResolvedValue({
    data: { user: { id: owner } },
    error: null,
  });
  const result = await requestIdentity(
    new Request("https://fitness.example", {
      headers: { Authorization: "Bearer real-token" },
    }),
  );
  expect(auth.getUser).toHaveBeenCalledExactlyOnceWith("real-token");
  expect(result.user?.id).toBe(owner);
  auth.getUser.mockResolvedValue({
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
it("anonymous requests do not create an auth session", async () => {
  expect((await requestIdentity(new Request("https://fitness.example"))).user).toBeNull();
  expect(auth.getUser).not.toHaveBeenCalled();
});
it("owner login returns a remembered session without returning or storing a password", async () => {
  auth.signInWithPassword.mockResolvedValue({
    data: {
      session: { access_token: "access", refresh_token: "refresh" },
      user: { id: owner },
    },
    error: null,
  });
  const response = await POST(
    new Request("https://fitness.example/api/session", {
      body: JSON.stringify({
        email: "owner@example.com",
        password: "private-password",
      }),
      headers: { origin: "https://fitness.example" },
      method: "POST",
    }),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    session: { access_token: "access", refresh_token: "refresh" },
  });
  expect(response.headers.get("cache-control")).toContain("no-store");
});
it("a valid login for another account does not receive editing session tokens", async () => {
  auth.signInWithPassword.mockResolvedValue({
    data: {
      session: { access_token: "access", refresh_token: "refresh" },
      user: { id: "another-user" },
    },
    error: null,
  });
  const response = await POST(
    new Request("https://fitness.example/api/session", {
      body: JSON.stringify({
        email: "other@example.com",
        password: "private-password",
      }),
      headers: { origin: "https://fitness.example" },
      method: "POST",
    }),
  );
  expect(response.status).toBe(403);
  expect((await response.json()).session).toBeUndefined();
  expect(auth.signOut).toHaveBeenCalledOnce();
});
