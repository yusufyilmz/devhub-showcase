import { beforeEach, expect, it, vi } from "vitest";

import { AuthAccessError, type AuthClient, requireConfirmedUser } from "../packages/auth/src";
import { createAuthHandlers } from "../packages/auth/src/handlers";

const auth = {
  exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(),
  signInWithOAuth: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
};
const client = { auth } as unknown as AuthClient;
const provision = vi.fn();
const factory = vi.fn(async () => client);
const options = {
  afterSignIn: provision,
  callbackPath: "/fitness/auth/callback",
  createClient: factory,
  loginPath: "/fitness/login",
  successPath: "/fitness/dashboard",
};
const handlers = createAuthHandlers(options);
const origin = "https://fitness.example";
const post = (body: unknown, path = "/fitness/session", source = origin) =>
  new Request(origin + path, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", origin: source },
    method: "POST",
  });
beforeEach(() => {
  vi.resetAllMocks();
  factory.mockResolvedValue(client);
  auth.getUser.mockResolvedValue({
    data: {
      user: { email_confirmed_at: "today", id: "verified-fitness-user" },
    },
    error: null,
  });
  auth.signInWithOAuth.mockResolvedValue({
    data: {
      url: "https://project.supabase.co/auth/v1/authorize?provider=google",
    },
    error: null,
  });
  auth.exchangeCodeForSession.mockResolvedValue({ error: null });
  auth.signInWithPassword.mockResolvedValue({ error: null });
  auth.signOut.mockResolvedValue({ error: null });
});
it("uses a second app callback and ignores untrusted redirect/forwarded-host input", async () => {
  const response = await handlers.google(post({}, "/fitness/google?next=https://evil.example"));
  expect(response.status).toBe(303);
  expect(auth.signInWithOAuth.mock.calls[0]?.[0].options.redirectTo).toBe(
    `${origin}/fitness/auth/callback`,
  );
  const callback = await handlers.callback(
    new Request(`${origin}/fitness/auth/callback?code=valid&next=//evil.example`, {
      headers: { "x-forwarded-host": "evil.example" },
    }),
  );
  expect(callback.headers.get("Location")).toBe(`${origin}/fitness/dashboard`);
  expect(provision).toHaveBeenCalledWith(client);
  expect(callback.headers.get("Cache-Control")).toBe("no-store");
  expect(callback.headers.get("Referrer-Policy")).toBe("no-referrer");
});
it.each(["https://evil.example", "null", ""])(
  "blocks cross-origin state changes: %s",
  async (source) => {
    for (const action of [handlers.google, handlers.signIn, handlers.signOut])
      expect((await action(post({}, "/fitness/session", source))).status).toBe(403);
    expect(factory).not.toHaveBeenCalled();
  },
);
it("verifies identity before running app provisioning and clears an unconfirmed session", async () => {
  auth.getUser.mockResolvedValue({
    data: { user: { email_confirmed_at: null, id: "unconfirmed" } },
    error: null,
  });
  const response = await handlers.callback(
    new Request(`${origin}/fitness/auth/callback?code=valid`),
  );
  expect(response.headers.get("Location")).toBe(`${origin}/fitness/login?error=unconfirmed`);
  expect(provision).not.toHaveBeenCalled();
  expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  await expect(requireConfirmedUser(client)).rejects.toBeInstanceOf(AuthAccessError);
});
it("does not trust a user object returned alongside an auth error", async () => {
  auth.getUser.mockResolvedValue({
    data: { user: { email_confirmed_at: "today", id: "untrusted" } },
    error: new Error("invalid token"),
  });
  await expect(requireConfirmedUser(client)).rejects.toBeInstanceOf(AuthAccessError);
});
it("supports password login with app-owned provisioning and private responses", async () => {
  const response = await handlers.signIn(
    post({ email: "test@example.com", password: "synthetic-test-password" }),
  );
  expect(response.status).toBe(200);
  expect(provision).toHaveBeenCalledWith(client);
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
});
it("rejects malformed, oversized and rejected credentials before provisioning", async () => {
  expect((await handlers.signIn(post({ email: "invalid", password: "" }))).status).toBe(400);
  expect((await handlers.signIn(post({ padding: "x".repeat(10001) }))).status).toBe(413);
  auth.signInWithPassword.mockResolvedValue({ error: new Error("rejected") });
  expect(
    (await handlers.signIn(post({ email: "test@example.com", password: "synthetic" }))).status,
  ).toBe(401);
  expect(provision).not.toHaveBeenCalled();
});
it("clears a password session if application provisioning fails", async () => {
  provision.mockRejectedValue(new Error("fitness storage unavailable"));
  const response = await handlers.signIn(
    post({ email: "test@example.com", password: "synthetic" }),
  );
  expect(response.status).toBe(503);
  expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  expect(JSON.stringify(await response.json())).not.toContain("fitness storage unavailable");
});
it("signs out only the current session and reports failures", async () => {
  expect((await handlers.signOut(post({}))).status).toBe(200);
  expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  auth.signOut.mockResolvedValue({ error: new Error("failure") });
  expect((await handlers.signOut(post({}))).status).toBe(503);
});
it.each(["https://evil.example", "//evil.example", "/\\evil.example"])(
  "rejects external app path configuration %s",
  (path) => {
    expect(() => createAuthHandlers({ ...options, successPath: path })).toThrow(
      "local application paths",
    );
  },
);
