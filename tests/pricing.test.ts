import { expect, it, vi } from "vitest";

import { StripeBilling } from "../packages/lib/src/billing/stripe";

const config = {
  chat: 100,
  editor: 10,
  key: "sk_test_fake",
  origin: "https://example.test",
  price: "price_demo",
  webhook: "whsec_test",
};
it("returns only the configured flat sandbox price and limits", async () => {
  const retrieve = vi.fn().mockResolvedValue({
    active: true,
    billing_scheme: "per_unit",
    currency: "eur",
    id: "price_demo",
    livemode: false,
    recurring: { interval: "month", interval_count: 1, usage_type: "licensed" },
    type: "recurring",
    unit_amount: 900,
  });
  const model = new StripeBilling(
    { prices: { retrieve } } as unknown as ConstructorParameters<typeof StripeBilling>[0],
    config,
  );
  expect(await model.publicPlan()).toEqual({
    amount: 900,
    available: true,
    chatLimit: 100,
    currency: "eur",
    editorLimit: 10,
    interval: "month",
    mode: "test",
  });
  retrieve.mockResolvedValue({
    active: true,
    billing_scheme: "per_unit",
    livemode: true,
    recurring: { interval: "month", interval_count: 1, usage_type: "licensed" },
    type: "recurring",
  });
  await expect(model.publicPlan()).rejects.toThrow();
  retrieve.mockResolvedValue({
    active: true,
    billing_scheme: "per_unit",
    livemode: false,
    recurring: { interval: "month", interval_count: 1, usage_type: "licensed" },
    type: "recurring",
    unit_amount: null,
  });
  await expect(model.publicPlan()).rejects.toThrow();
});
