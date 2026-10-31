import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ assign: vi.fn(), summary: vi.fn(), user: vi.fn() }));
vi.mock("@shared/auth", async (original) => ({
  ...(await original<typeof import("../packages/auth/src/index")>()),
  requireConfirmedUser: mocks.user,
}));
vi.mock("@shared/lib/supabase", () => ({ createServerClient: vi.fn().mockResolvedValue({}) }));
vi.mock("@shared/lib/billing-repository", () => ({
  BillingRepository: class {
    summary = mocks.summary;
    assign = mocks.assign;
  },
}));
vi.mock("../apps/web/lib/admin-auth", () => ({
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://example.test",
}));

import { GET, PUT } from "../apps/web/app/api/admin/billing/route";
import { AuthAccessError } from "../packages/auth/src/index";

const id = "11111111-1111-4111-8111-111111111111";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue({ id });
  mocks.summary.mockResolvedValue({ plan: "free" });
  mocks.assign.mockResolvedValue(undefined);
});
function put(body: unknown, origin = "https://example.test") {
  return PUT(
    new Request("https://example.test/api/admin/billing", {
      body: JSON.stringify(body),
      headers: { origin },
      method: "PUT",
    }),
  );
}
it("uses confirmed account identity and private caching", async () => {
  const result = await GET();
  expect(result.headers.get("cache-control")).toBe("private, no-store");
  expect(mocks.summary).toHaveBeenCalledWith(id);
  mocks.user.mockRejectedValue(new AuthAccessError());
  expect((await GET()).status).toBe(403);
});
it("allows assignment but denies client grants and foreign origins", async () => {
  expect((await put({ profileId: "alpha" })).status).toBe(200);
  expect(mocks.assign).toHaveBeenCalledWith(id, "alpha");
  expect((await put({ plan: "pro", profileId: "alpha" })).status).toBe(400);
  expect((await put({ profileId: "alpha" }, "https://other.test")).status).toBe(403);
  expect(mocks.assign).toHaveBeenCalledTimes(1);
});
it("fails closed on storage errors and oversized requests", async () => {
  mocks.summary.mockRejectedValue(new Error("offline"));
  expect((await GET()).status).toBe(503);
  expect((await put({ profileId: "x".repeat(2000) })).status).toBe(413);
});
