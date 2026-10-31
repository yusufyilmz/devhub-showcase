import { expect, it } from "vitest";

import {
  billingSummarySchema,
  type Entitlement,
  entitlementSummary,
  premiumFeatureStatus,
} from "../packages/lib/src/billing";

const start = Date.parse("2026-10-01T00:00:00Z");
const end = Date.parse("2026-11-01T00:00:00Z");
const grant: Entitlement = {
  account_id: "11111111-1111-4111-8111-111111111111",
  chat_limit: 20,
  editor_limit: 5,
  period_end: new Date(end).toISOString(),
  period_start: new Date(start).toISOString(),
  plan: "pro",
  status: "active",
};
it("explains the exact start and expiry boundaries without granting inactive access", () => {
  expect(entitlementSummary(null, start).access).toBe("free");
  expect(entitlementSummary(grant, start - 1)).toMatchObject({ access: "scheduled", plan: "free" });
  expect(entitlementSummary(grant, start)).toMatchObject({ access: "active", plan: "pro" });
  expect(entitlementSummary(grant, end)).toMatchObject({
    access: "expired",
    limits: { portfolio_chat: 0 },
    plan: "free",
  });
  for (const status of ["past_due", "canceled", "inactive"] as const)
    expect(entitlementSummary({ ...grant, status }, start)).toMatchObject({
      access: status,
      plan: "free",
    });
});
it("separates assignment, configuration, usage and visitor publication guidance", () => {
  const billing = billingSummarySchema.parse({
    ...entitlementSummary(grant, start),
    assignedProfileId: "alpha",
    chatEnabled: false,
    usage: { portfolio_chat: 0, studio_assistant: 0 },
  });
  const profile = { id: "alpha", isPublic: false };
  expect(premiumFeatureStatus(billing, profile, "studio_assistant", true)).toBe("ready");
  expect(premiumFeatureStatus(billing, profile, "portfolio_chat", true)).toBe("unpublished");
  expect(
    premiumFeatureStatus(billing, { ...profile, isPublic: true }, "portfolio_chat", true),
  ).toBe("disabled");
  expect(premiumFeatureStatus(billing, profile, "studio_assistant", false)).toBe("setup_required");
  expect(
    premiumFeatureStatus(
      { ...billing, assignedProfileId: "other" },
      profile,
      "studio_assistant",
      true,
    ),
  ).toBe("unassigned");
  expect(
    premiumFeatureStatus(
      { ...billing, usage: { ...billing.usage, studio_assistant: 5 } },
      profile,
      "studio_assistant",
      true,
    ),
  ).toBe("exhausted");
  expect(
    premiumFeatureStatus({ ...billing, plan: "free" }, profile, "studio_assistant", true),
  ).toBe("requires_pro");
  expect(
    premiumFeatureStatus(billing, { id: "main", isPublic: true }, "portfolio_chat", true),
  ).toBe("legacy");
});
