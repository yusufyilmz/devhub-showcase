import { afterEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getSession: vi.fn(),
  setSession: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));

import { authorizationHeaders, rememberSession, signOut } from "../lib/supabase/browser";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("uses persistent localStorage sessions, auto-refresh, and clears the login through sign-out", async () => {
  const localStorage = {
    getItem: vi.fn(),
    removeItem: vi.fn(),
    setItem: vi.fn(),
  };
  vi.stubGlobal("window", { localStorage });
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
  mocks.createClient.mockReturnValue({
    auth: {
      getSession: mocks.getSession,
      setSession: mocks.setSession,
      signOut: mocks.signOut,
    },
  });
  mocks.setSession.mockResolvedValue({ error: null });
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.getSession.mockResolvedValue({
    data: { session: { access_token: "renewed-access" } },
    error: null,
  });
  await rememberSession({ access_token: "access", refresh_token: "refresh" });
  expect(mocks.createClient).toHaveBeenCalledWith(
    "https://test.supabase.co",
    "publishable",
    expect.objectContaining({
      auth: expect.objectContaining({
        autoRefreshToken: true,
        persistSession: true,
        storage: localStorage,
        storageKey: "fitness-os-session",
      }),
    }),
  );
  expect(mocks.setSession).toHaveBeenCalledExactlyOnceWith({
    access_token: "access",
    refresh_token: "refresh",
  });
  expect(await authorizationHeaders()).toEqual({
    Authorization: "Bearer renewed-access",
  });
  await signOut();
  expect(mocks.signOut).toHaveBeenCalledExactlyOnceWith({ scope: "local" });
});
