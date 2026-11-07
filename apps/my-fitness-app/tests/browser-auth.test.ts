import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@shared/auth/client", () => ({ createClient: mocks.createClient }));

import { urls } from "@shared/config/urls";

import { authorizationHeaders, signOut } from "../lib/browser-session";

describe("Fitness browser session", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("reads the shared cookie client and clears that session through sign-out", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    mocks.createClient.mockReturnValue({
      auth: {
        getSession: mocks.getSession,
        signOut: mocks.signOut,
      },
    });
    mocks.signOut.mockResolvedValue({ error: null });
    mocks.getSession.mockResolvedValue({
      data: { session: { access_token: "renewed-access" } },
      error: null,
    });
    expect(await authorizationHeaders()).toEqual({
      Authorization: "Bearer renewed-access",
    });
    expect(mocks.createClient).toHaveBeenCalledOnce();
    await signOut();
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(urls.auth.session(), {
      method: "DELETE",
    });
    expect(mocks.signOut).toHaveBeenCalledExactlyOnceWith({ scope: "local" });
  });
});
