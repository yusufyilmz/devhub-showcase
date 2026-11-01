import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ user: vi.fn() }));
vi.mock("@shared/auth", async (original) => ({
  ...(await original<typeof import("@shared/auth")>()),
  requireConfirmedUser: mocks.user,
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://example.test",
}));

import { AuthAccessError, type AuthClient } from "@shared/auth";

const testClient = async () => ({}) as AuthClient;

import { BillingActionError } from "../index";
import { billingPost } from "./index";

describe("Handler", () => {
  it("checks origin and confirmed identity before creating billing sessions", async () => {
    const action = vi.fn().mockResolvedValue("https://checkout.stripe.com/test");
    const request = (origin: string) =>
      new Request("https://example.test/api/billing/checkout", {
        headers: { origin },
        method: "POST",
      });
    expect((await billingPost(request("https://other.test"), action, testClient)).status).toBe(403);
    expect(action).not.toHaveBeenCalled();
    mocks.user.mockRejectedValue(new AuthAccessError());
    expect((await billingPost(request("https://example.test"), action, testClient)).status).toBe(
      403,
    );
    expect(action).not.toHaveBeenCalled();
    mocks.user.mockResolvedValue({ id: "verified-account" });
    const response = await billingPost(request("https://example.test"), action, testClient);
    expect(response.status).toBe(200);
    expect(action).toHaveBeenCalledWith("verified-account");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("returns allowlisted billing error codes and hides raw upstream failures", async () => {
    mocks.user.mockResolvedValue({ id: "verified-account" });
    const request = () =>
      new Request("https://example.test/api/billing/portal", {
        headers: { origin: "https://example.test" },
        method: "POST",
      });
    const known = await billingPost(
      request(),
      async () => {
        throw new BillingActionError("no_subscription");
      },
      testClient,
    );
    expect(await known.json()).toMatchObject({ code: "no_subscription" });
    const unknown = await billingPost(
      request(),
      async () => {
        throw new Error("private provider response secret");
      },
      testClient,
    );
    expect(unknown.status).toBe(503);
    expect(await unknown.text()).not.toContain("secret");
  });
});
