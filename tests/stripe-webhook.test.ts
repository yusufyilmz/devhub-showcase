import { beforeEach, expect, it, vi } from "vitest";

import { createStripe } from "../packages/lib/src/billing/stripe";

const mocks = vi.hoisted(() => ({ gateway: vi.fn(), sync: vi.fn() }));
vi.mock("../apps/web/lib/billing/gateway", () => ({
  billingGateway: mocks.gateway,
  synchronize: mocks.sync,
}));

import { POST } from "../apps/web/app/api/billing/webhook/route";

beforeEach(() => {
  vi.clearAllMocks();
  for (const [name, value] of Object.entries({
    NEXT_PUBLIC_SITE_URL: "https://example.test",
    STRIPE_PRO_CHAT_LIMIT: "100",
    STRIPE_PRO_EDITOR_LIMIT: "10",
    STRIPE_PRO_PRICE_ID: "price_test",
    STRIPE_SECRET_KEY: "sk_test_fake",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
  }))
    vi.stubEnv(name, value);
  mocks.gateway.mockReturnValue({ config: { webhook: "whsec_test" }, stripe: createStripe() });
  mocks.sync.mockResolvedValue(undefined);
});
function request(body: string, signature: string) {
  return POST(
    new Request("https://example.test/api/billing/webhook", {
      body,
      headers: { "stripe-signature": signature },
      method: "POST",
    }),
  );
}
it("rejects unsigned and tampered payloads before synchronization", async () => {
  expect((await request("{}", "invalid")).status).toBe(400);
  expect(mocks.sync).not.toHaveBeenCalled();
});
it("accepts authentic test events and retries failures without acknowledging success", async () => {
  const body = JSON.stringify({
    data: { object: { customer: "cus_test" } },
    id: "evt_test",
    livemode: false,
    type: "customer.subscription.updated",
  });
  const signature = createStripe().webhooks.generateTestHeaderString({
    payload: body,
    secret: "whsec_test",
  });
  expect((await request(body, signature)).status).toBe(200);
  expect(mocks.sync).toHaveBeenCalledWith("cus_test", "evt_test");
  mocks.sync.mockRejectedValue(new Error("busy"));
  expect((await request(body, signature)).status).toBe(503);
});
