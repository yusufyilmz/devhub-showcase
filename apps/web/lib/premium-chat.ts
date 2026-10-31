import { allowPortfolioChat } from "@shared/cache";
import { PortfolioChatModel } from "@shared/chat";
import { entitlementSchema, entitlementSummary, runPremiumOperation } from "@shared/lib/billing";
import { type BillingClient, PremiumUsageRepository } from "@shared/lib/billing-repository";
import { buildPublicPortfolioKnowledge } from "@shared/lib/portfolio-knowledge";
import { readPublicProfileByUsername } from "@shared/lib/published-profile";
import { usernameSchema } from "@shared/lib/username";
import { z } from "zod";

import { billingServiceClient } from "./billing/client";

export const premiumChatInput = z
  .object({
    message: z.string().trim().min(1).max(2000),
    requestId: z.uuid(),
    sessionId: z.uuid(),
    username: usernameSchema,
  })
  .strict();
export async function premiumChatAccount(profileId: string) {
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
export async function premiumChatAvailable(profileId: string) {
  if (
    profileId === "main" ||
    !process.env.OPENAI_API_KEY ||
    !process.env.REDIS_URL ||
    !process.env.REDIS_TOKEN
  )
    return false;
  try {
    return Boolean(await premiumChatAccount(profileId));
  } catch {
    return false;
  }
}
export async function answerPremiumChat(raw: unknown, signal: AbortSignal) {
  const input = premiumChatInput.parse(raw);
  const snapshot = await readPublicProfileByUsername(input.username);
  if (!snapshot?.id || snapshot.id === "main") throw new Error("Unavailable");
  const knowledge = buildPublicPortfolioKnowledge(snapshot);
  const account = await premiumChatAccount(snapshot.id);
  if (
    !knowledge ||
    !account ||
    !process.env.OPENAI_API_KEY ||
    !process.env.REDIS_URL ||
    !process.env.REDIS_TOKEN
  )
    throw new Error("Unavailable");
  if (!(await allowPortfolioChat(snapshot.id, input.sessionId))) throw new Error("Limit reached");
  const usage = new PremiumUsageRepository(billingServiceClient() as unknown as BillingClient);
  const answer = await runPremiumOperation(
    usage,
    {
      accountId: account,
      feature: "portfolio_chat",
      profileId: snapshot.id,
      requestId: input.requestId,
    },
    () => new PortfolioChatModel().answer(knowledge, input.message, signal),
  );
  return { answer, revision: snapshot.revision };
}
