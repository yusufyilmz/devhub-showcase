import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ read: vi.fn(), workspace: vi.fn() }));
vi.mock("../apps/web/lib/admin-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://example.test",
}));
vi.mock("../apps/web/lib/google-profile-import", async (original) => ({
  ...(await original<typeof import("../apps/web/lib/google-profile-import")>()),
  readGoogleProfile: mocks.read,
}));

import { GET, POST } from "../apps/web/app/api/admin/google-profile/route";
import { ProfileAccessError } from "../packages/lib/src/repositories/profile-repository";

const token = "google-access-token-sample";
function request(body: unknown, origin = "https://example.test") {
  return new Request("https://example.test/api/admin/google-profile", {
    body: JSON.stringify(body),
    headers: { origin },
    method: "POST",
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("GOOGLE_PROFILE_CLIENT_ID", "123-example.apps.googleusercontent.com");
  mocks.workspace.mockResolvedValue({ user: { id: "verified-owner" } });
  mocks.read.mockResolvedValue({ notes: [], suggestions: [] });
});
afterEach(() => vi.unstubAllEnvs());
it("requires confirmed ownership before reading tokens or Google data", async () => {
  mocks.workspace.mockRejectedValue(new ProfileAccessError());
  expect((await GET()).status).toBe(403);
  expect((await POST(request({ categories: ["basic"], token }))).status).toBe(403);
  expect(mocks.read).not.toHaveBeenCalled();
});
it("checks origin, category allowlist, size and configuration and never accepts client ownership", async () => {
  expect((await POST(request({ categories: ["basic"], token }, "https://other.test"))).status).toBe(
    403,
  );
  expect((await POST(request({ categories: ["gmail"], token }))).status).toBe(400);
  expect(
    (await POST(request({ categories: ["basic"], ownerId: "someone-else", token }))).status,
  ).toBe(400);
  expect((await POST(request({ categories: ["basic"], token: "x".repeat(13000) }))).status).toBe(
    413,
  );
  expect(mocks.read).not.toHaveBeenCalled();
  vi.stubEnv("GOOGLE_PROFILE_CLIENT_ID", "");
  expect(await (await GET()).json()).toEqual({ clientId: null, enabled: false });
  expect((await POST(request({ categories: ["basic"], token }))).status).toBe(503);
});
it("returns only review suggestions with private caching and hides upstream errors", async () => {
  const response = await POST(request({ categories: ["basic", "work"], token }));
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(await response.json()).toEqual({ notes: [], suggestions: [] });
  expect(mocks.read).toHaveBeenCalledWith(token, ["basic", "work"], expect.any(AbortSignal));
  mocks.read.mockRejectedValue(new Error("secret Google payload and token"));
  const failed = await POST(request({ categories: ["basic"], token }));
  expect(failed.status).toBe(503);
  expect(await failed.text()).not.toContain("secret");
});
