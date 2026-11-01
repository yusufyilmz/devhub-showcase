import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  oauth: vi.fn(),
}));
const client = {
  auth: {
    getUser: mocks.getUser,
    signInWithOAuth: mocks.oauth,
  },
};
vi.mock("@shared/lib/supabase", () => ({
  createServerClient: async () => client,
}));

import { POST } from "./route";

describe("Google", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getUser.mockResolvedValue({
      data: { user: { email_confirmed_at: "today", id: "verified-user" } },
      error: null,
    });
    mocks.oauth.mockResolvedValue({
      data: {
        url: "https://example.supabase.co/auth/v1/authorize?provider=google",
      },
      error: null,
    });
  });
  const origin = "https://yusufdevhub.vercel.app";

  it("starts PKCE at a fixed callback and redirects to the provider", async () => {
    const response = await POST(
      new Request(`${origin}/api/admin/google?next=https://evil.example`, {
        headers: { origin },
        method: "POST",
      }),
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain(
      "https://example.supabase.co/auth/v1/authorize",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.oauth).toHaveBeenCalledWith({
      options: {
        queryParams: { prompt: "select_account" },
        redirectTo: `${origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
      provider: "google",
    });
  });
  it.each(["https://evil.example", "null", ""])(
    "rejects an untrusted origin: %s",
    async (requestOrigin) => {
      expect(
        (
          await POST(
            new Request(`${origin}/api/admin/google`, {
              headers: { origin: requestOrigin },
              method: "POST",
            }),
          )
        ).status,
      ).toBe(403);
      expect(mocks.oauth).not.toHaveBeenCalled();
    },
  );
  it("handles provider setup errors without exposing details", async () => {
    mocks.oauth.mockRejectedValue(new Error("internal configuration"));
    const response = await POST(
      new Request(`${origin}/api/admin/google`, {
        headers: { origin },
        method: "POST",
      }),
    );
    expect(response.headers.get("location")).toBe(`${origin}/admin/login?error=google_failed`);
  });
});
