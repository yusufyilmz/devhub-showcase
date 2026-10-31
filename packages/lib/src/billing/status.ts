import { z } from "zod";

import type { PremiumFeature } from "./index";

const counts = z.object({
  portfolio_chat: z.number().int().nonnegative(),
  studio_assistant: z.number().int().nonnegative(),
});
export const billingSummarySchema = z.object({
  access: z.enum(["free", "active", "expired", "scheduled", "past_due", "canceled", "inactive"]),
  assignedProfileId: z.string().nullable(),
  chatEnabled: z.boolean(),
  limits: counts,
  periodEnd: z.iso.datetime({ offset: true }).nullable(),
  periodStart: z.iso.datetime({ offset: true }).nullable(),
  plan: z.enum(["free", "pro"]),
  usage: counts,
});
export type BillingSummary = z.infer<typeof billingSummarySchema>;
/** Display guidance only. The server reservation remains the access authority. */
export function premiumFeatureStatus(
  billing: BillingSummary,
  profile: { id: string; isPublic: boolean },
  feature: PremiumFeature,
  configured: boolean,
) {
  if (feature === "portfolio_chat" && profile.id === "main") return "legacy";
  if (billing.plan !== "pro") return "requires_pro";
  if (billing.assignedProfileId !== profile.id) return "unassigned";
  if (!configured) return "setup_required";
  if (billing.usage[feature] >= billing.limits[feature]) return "exhausted";
  if (feature === "portfolio_chat" && !profile.isPublic) return "unpublished";
  if (feature === "portfolio_chat" && !billing.chatEnabled) return "disabled";
  return "ready";
}
