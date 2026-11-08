import { z } from "zod";

import { entitlementSchema, entitlementSummary, runPremiumOperation } from "@shared/billing";
import { billingServiceClient } from "@shared/billing/client";
import { type BillingClient, PremiumUsageRepository } from "@shared/billing/server";
import { allowPortfolioChat } from "@shared/lib/cache";
import { buildPublicPortfolioKnowledge, usernameSchema } from "@shared/lib/profiles";
import { readPublicProfileByUsername } from "@shared/lib/published-profile";

import { PortfolioChatModel } from "../models/portfolio-chat-model";

export const premiumChatInput = z
  .object({
    message: z.string().trim().min(1).max(2000),
    requestId: z.uuid(),
    sessionId: z.uuid(),
    username: usernameSchema,
  })
  .strict();
export function createPremiumPortfolioChat({ configured }: { configured: () => boolean }) {
  async function premiumChatAccount(profileId: string) {
    const db = billingServiceClient();
    const row = await db
      .from("portfolio_profiles")
      .select("owner_id,is_public")
      .eq("id", profileId)
      .maybeSingle();
    if (row.error) throw new Error("Unavailable");
    if (!row.data?.is_public || !row.data.owner_id) return null;
    const account = row.data.owner_id;
    const assignment = await db
      .from("billing_assignments")
      .select("profile_id,chat_enabled")
      .eq("account_id", account)
      .maybeSingle();
    const entitlement = await db
      .from("billing_entitlements")
      .select("*")
      .eq("account_id", account)
      .maybeSingle();
    if (assignment.error || entitlement.error) throw new Error("Unavailable");
    if (!assignment.data?.chat_enabled || assignment.data.profile_id !== profileId) return null;
    const summary = entitlementSummary(entitlementSchema.parse(entitlement.data));
    return summary.plan === "pro" && summary.limits.portfolio_chat > 0 ? account : null;
  }
  async function premiumChatAvailable(profileId: string) {
    if (profileId === "main" || !configured()) return false;
    try {
      return Boolean(await premiumChatAccount(profileId));
    } catch {
      return false;
    }
  }
  async function answerPremiumChat(raw: unknown, signal: AbortSignal) {
    signal.throwIfAborted();
    const input = premiumChatInput.parse(raw);
    const snapshot = await readPublicProfileByUsername(input.username);
    if (!snapshot?.id || snapshot.id === "main") throw new Error("Unavailable");
    const knowledge = buildPublicPortfolioKnowledge(snapshot);
    const account = await premiumChatAccount(snapshot.id);
    if (!knowledge || !account || !configured()) throw new Error("Unavailable");
    if (!(await allowPortfolioChat(snapshot.id, input.sessionId))) throw new Error("Limit reached");
    const usage = new PremiumUsageRepository(billingServiceClient() as unknown as BillingClient);
    const answer = await runPremiumOperation(
      usage,
      {
        accountId: account,
        feature: "portfolio_chat",
        profileId: snapshot.id,
        requestId: input.requestId,
        signal,
      },
      () => new PortfolioChatModel().answer(knowledge, input.message, signal),
    );
    const latest = await readPublicProfileByUsername(input.username);
    if (
      !latest?.isPublic ||
      latest.id !== snapshot.id ||
      latest.revision !== snapshot.revision ||
      !(await premiumChatAccount(snapshot.id))
    )
      throw new Error("The published portfolio changed. Reload before asking again.");
    return { answer, revision: snapshot.revision };
  }

  return { answerPremiumChat, premiumChatAccount, premiumChatAvailable };
}
