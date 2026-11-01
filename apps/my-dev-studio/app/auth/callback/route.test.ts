import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/lib/profile-errors";

const mocks = vi.hoisted(() => ({
  exchange: vi.fn(),
  getUser: vi.fn(),
  owner: vi.fn(),
  signOut: vi.fn(),
}));
const client = {
  auth: {
    exchangeCodeForSession: mocks.exchange,
    getUser: mocks.getUser,
    signOut: mocks.signOut,
  },
};
vi.mock("@shared/lib/supabase", () => ({
  createServerClient: async () => client,
}));
vi.mock("@/features/admin/admin-auth", async (original) => ({
  ...(await original<typeof import("@/features/admin/admin-auth")>()),
  requireWorkspace: mocks.owner,
}));

import { GET } from "./route";

describe("Callback", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getUser.mockResolvedValue({
      data: { user: { email_confirmed_at: "today", id: "verified-user" } },
      error: null,
    });
    mocks.exchange.mockResolvedValue({ error: null });
    mocks.owner.mockResolvedValue({});
    mocks.signOut.mockResolvedValue({ error: null });
  });
  const origin = "https://yusufdevhub.vercel.app";

  it("exchanges the code, opens the account workspace, and ignores arbitrary redirect targets", async () => {
    const response = await GET(
      new Request(`${origin}/auth/callback?code=valid-code&next=//evil.example`, {
        headers: { "x-forwarded-host": "evil.example" },
      }),
    );
    expect(mocks.exchange).toHaveBeenCalledWith("valid-code");
    expect(mocks.owner).toHaveBeenCalledWith(client);
    expect(response.headers.get("location")).toBe(`${origin}/admin`);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });
  it.each(["?error=access_denied", "", "?code=bad&error=access_denied"])(
    "handles cancelled or missing authorization: %s",
    async (query) => {
      const response = await GET(new Request(`${origin}/auth/callback${query}`));
      expect(response.headers.get("location")).toBe(`${origin}/admin/login?error=google_failed`);
      expect(mocks.exchange).not.toHaveBeenCalled();
    },
  );
  it("rejects a failed PKCE exchange before ownership checks", async () => {
    mocks.exchange.mockResolvedValue({ error: new Error("bad verifier") });
    expect(
      (await GET(new Request(`${origin}/auth/callback?code=invalid`))).headers.get("location"),
    ).toContain("error=google_failed");
    expect(mocks.owner).not.toHaveBeenCalled();
  });
  it("clears the local session for an unconfirmed session", async () => {
    mocks.owner.mockRejectedValue(new ProfileAccessError());
    expect(
      (await GET(new Request(`${origin}/auth/callback?code=valid`))).headers.get("location"),
    ).toBe(`${origin}/admin/login?error=not_owner`);
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
  it("clears the session when workspace storage is unavailable", async () => {
    mocks.owner.mockRejectedValue(new Error("missing table"));
    expect(
      (await GET(new Request(`${origin}/auth/callback?code=valid`))).headers.get("location"),
    ).toBe(`${origin}/admin/login?error=setup`);
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});
