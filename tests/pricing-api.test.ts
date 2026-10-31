import { expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ pricing: vi.fn() }));
vi.mock("../apps/web/lib/public-pricing", () => ({ publicPricing: mocks.pricing }));

import { GET } from "../apps/web/app/api/billing/pricing/route";

it("publicly caches safe pricing but never caches a configuration error", async () => {
  mocks.pricing.mockResolvedValue({ amount: 900, available: true, currency: "eur", mode: "test" });
  const response = await GET();
  expect(response.headers.get("cache-control")).toContain("public");
  mocks.pricing.mockRejectedValue(new Error("sk_test_SECRET"));
  const error = await GET();
  expect(error.status).toBe(503);
  expect(error.headers.get("cache-control")).toBe("no-store");
  expect(JSON.stringify(await error.json())).not.toContain("SECRET");
});
