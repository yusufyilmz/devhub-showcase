import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import {
  type Entitlement,
  entitlementSchema,
  entitlementSummary,
  type PremiumFeature,
  type PremiumUsage,
} from "./index";

type Table<Row> = { Row: Row; Insert: Row; Update: Partial<Row>; Relationships: [] };
type Usage = {
  request_id: string;
  account_id: string;
  profile_id: string;
  feature: PremiumFeature;
  period_start: string;
  created_at: string;
  outcome: "reserved" | "succeeded" | "failed";
};
type BillingDatabase = {
  public: {
    Tables: {
      billing_entitlements: Table<Entitlement>;
      billing_assignments: Table<{ account_id: string; profile_id: string; chat_enabled: boolean }>;
      billing_usage: Table<Usage>;
    };
    Views: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Functions: {
      reserve_premium_usage: {
        Args: { p_account: string; p_profile: string; p_feature: string; p_request: string };
        Returns: boolean;
      };
    };
  };
};
export type BillingClient = SupabaseClient<BillingDatabase>;
/** Use a session client for reads and assignment. RLS enforces ownership. */
export class BillingRepository {
  constructor(private readonly client: BillingClient) {}
  async summary(accountId: string) {
    z.uuid().parse(accountId);
    const record = await this.client
      .from("billing_entitlements")
      .select("*")
      .eq("account_id", accountId)
      .maybeSingle();
    const assignment = await this.client
      .from("billing_assignments")
      .select("profile_id,chat_enabled")
      .eq("account_id", accountId)
      .maybeSingle();
    if (record.error || assignment.error) throw new Error("Billing unavailable.");
    const entitlement = record.data ? entitlementSchema.parse(record.data) : null;
    const usage = { portfolio_chat: 0, studio_assistant: 0 };
    if (entitlement)
      for (const feature of ["portfolio_chat", "studio_assistant"] as const) {
        const result = await this.client
          .from("billing_usage")
          .select("request_id", { count: "exact", head: true })
          .eq("account_id", accountId)
          .eq("period_start", entitlement.period_start)
          .eq("feature", feature);
        if (result.error || result.count === null) throw new Error("Billing unavailable.");
        usage[feature] = result.count;
      }
    return {
      ...entitlementSummary(entitlement),
      assignedProfileId: assignment.data?.profile_id ?? null,
      chatEnabled: assignment.data?.chat_enabled ?? false,
      usage,
    };
  }
  async assign(accountId: string, profileId: string | null, chatEnabled = false) {
    z.uuid().parse(accountId);
    const query = this.client.from("billing_assignments");
    const result =
      profileId === null
        ? await query.delete().eq("account_id", accountId)
        : await query.upsert({
            account_id: accountId,
            chat_enabled: chatEnabled,
            profile_id: z.string().min(1).max(100).parse(profileId),
          });
    if (result.error) throw new Error("Assignment denied or unavailable.");
  }
}
/** Requires trusted server credentials. Never expose reservation through a browser route. */
export class PremiumUsageRepository implements PremiumUsage {
  constructor(private readonly client: BillingClient) {}
  async reserve(accountId: string, profileId: string, feature: PremiumFeature, requestId: string) {
    const result = await this.client.rpc("reserve_premium_usage", {
      p_account: accountId,
      p_feature: feature,
      p_profile: profileId,
      p_request: requestId,
    });
    if (result.error) throw new Error("Usage unavailable.");
    return result.data === true;
  }
  async finish(requestId: string, outcome: "succeeded" | "failed") {
    const result = await this.client
      .from("billing_usage")
      .update({ outcome })
      .eq("request_id", requestId)
      .eq("outcome", "reserved");
    if (result.error) throw new Error("Usage outcome unavailable.");
  }
}
