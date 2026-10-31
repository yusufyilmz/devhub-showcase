import { expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ user: vi.fn() }));
vi.mock("@shared/auth", async (original) => ({
  ...(await original<typeof import("../packages/auth/src/index")>()),
  requireConfirmedUser: mocks.user,
}));
vi.mock("@shared/lib/supabase", () => ({ createServerClient: async () => ({}) }));
vi.mock("../apps/web/lib/admin-auth", () => ({
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://example.test",
}));

import { billingPost } from "../apps/web/lib/billing/handler";
import { AuthAccessError } from "../packages/auth/src/index";

it("checks origin and confirmed identity before creating billing sessions", async () => {
  const action = vi.fn().mockResolvedValue("https://checkout.stripe.com/test");
  const request = (origin: string) =>
    new Request("https://example.test/api/billing/checkout", {
      headers: { origin },
      method: "POST",
    });
  expect((await billingPost(request("https://other.test"), action)).status).toBe(403);
  expect(action).not.toHaveBeenCalled();
  mocks.user.mockRejectedValue(new AuthAccessError());
  expect((await billingPost(request("https://example.test"), action)).status).toBe(403);
  expect(action).not.toHaveBeenCalled();
  mocks.user.mockResolvedValue({ id: "verified-account" });
  const response = await billingPost(request("https://example.test"), action);
  expect(response.status).toBe(200);
  expect(action).toHaveBeenCalledWith("verified-account");
  expect(response.headers.get("cache-control")).toBe("private, no-store");
});
