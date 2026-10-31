import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ config: vi.fn(), portal: vi.fn(), row: vi.fn(), rpc: vi.fn() }));
vi.mock("@shared/lib/stripe", () => ({
  createStripe: () => ({}),
  ExistingSubscriptionError: class extends Error {},
  StripeBilling: class {
    portal = mocks.portal;
  },
  stripeConfiguration: mocks.config,
}));
vi.mock("../apps/web/lib/billing/client", () => ({
  billingServiceClient: () => ({
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.row }) }) }),
    rpc: mocks.rpc,
  }),
}));

import { billingGateway, portal, withBillingLease } from "../apps/web/lib/billing/gateway";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.config.mockReturnValue({});
});
it("distinguishes missing setup, a busy lease and storage errors", async () => {
  mocks.config.mockImplementationOnce(() => {
    throw new Error("secret config");
  });
  expect(() => billingGateway()).toThrow("setup is incomplete");
  const action = vi.fn();
  mocks.rpc.mockResolvedValue({ data: false, error: null });
  await expect(withBillingLease("owner", action)).rejects.toMatchObject({ code: "busy" });
  mocks.rpc.mockResolvedValue({ error: { message: "secret sql" } });
  await expect(withBillingLease("owner", action)).rejects.toMatchObject({ code: "unavailable" });
  expect(action).not.toHaveBeenCalled();
});
it("does not create a customer or subscription while explaining an absent portal", async () => {
  mocks.row.mockResolvedValue({ data: null, error: null });
  await expect(portal("owner")).rejects.toMatchObject({ code: "no_subscription" });
  expect(mocks.portal).not.toHaveBeenCalled();
  mocks.row.mockResolvedValue({ error: { message: "db error" } });
  await expect(portal("owner")).rejects.toMatchObject({ code: "unavailable" });
  mocks.row.mockResolvedValue({ data: { customer_id: "cus_test" }, error: null });
  mocks.portal.mockResolvedValue("https://billing.stripe.com/session");
  expect(await portal("owner")).toBe("https://billing.stripe.com/session");
  expect(mocks.portal).toHaveBeenCalledWith("cus_test");
});
