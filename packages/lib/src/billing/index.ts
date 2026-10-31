import { z } from "zod";

export { type BillingSummary, billingSummarySchema, premiumFeatureStatus } from "./status";

export const featureSchema = z.enum(["portfolio_chat", "studio_assistant"]);
export type PremiumFeature = z.infer<typeof featureSchema>;
export const entitlementSchema = z.object({
  account_id: z.uuid(),
  chat_limit: z.number().int().min(0).max(100000),
  editor_limit: z.number().int().min(0).max(100000),
  period_end: z.iso.datetime({ offset: true }),
  period_start: z.iso.datetime({ offset: true }),
  plan: z.enum(["free", "pro"]),
  status: z.enum(["inactive", "active", "trialing", "past_due", "canceled"]),
});
export type Entitlement = z.infer<typeof entitlementSchema>;
export type PlanAccess =
  | "free"
  | "active"
  | "expired"
  | "scheduled"
  | "past_due"
  | "canceled"
  | "inactive";
function planAccess(record: Entitlement | null, now: number): PlanAccess {
  if (record?.plan !== "pro") return "free";
  if (record.status !== "active" && record.status !== "trialing") return record.status;
  if (now < Date.parse(record.period_start)) return "scheduled";
  return now < Date.parse(record.period_end) ? "active" : "expired";
}
export function entitlementSummary(record: Entitlement | null, now = Date.now()) {
  const access = planAccess(record, now);
  const active = access === "active";
  return {
    access,
    limits: {
      portfolio_chat: active && record ? record.chat_limit : 0,
      studio_assistant: active && record ? record.editor_limit : 0,
    },
    periodEnd: record?.period_end ?? null,
    periodStart: record?.period_start ?? null,
    plan: active ? ("pro" as const) : ("free" as const),
  };
}
export interface PremiumUsage {
  finish(requestId: string, outcome: "succeeded" | "failed"): Promise<void>;
  reserve(
    accountId: string,
    profileId: string,
    feature: PremiumFeature,
    requestId: string,
  ): Promise<boolean>;
}
/** Invoke only with server-resolved identities and a trusted reservation adapter. */
export async function runPremiumOperation<T>(
  usage: PremiumUsage,
  input: { accountId: string; profileId: string; feature: PremiumFeature; requestId: string },
  operation: () => Promise<T>,
): Promise<T> {
  z.uuid().parse(input.accountId);
  z.uuid().parse(input.requestId);
  featureSchema.parse(input.feature);
  if (!(await usage.reserve(input.accountId, input.profileId, input.feature, input.requestId)))
    throw new Error("Premium access unavailable or allowance exhausted.");
  let value: T;
  try {
    value = await operation();
  } catch (error) {
    await usage.finish(input.requestId, "failed").catch(() => undefined);
    throw error;
  }
  await usage.finish(input.requestId, "succeeded").catch(() => undefined);
  return value;
}
