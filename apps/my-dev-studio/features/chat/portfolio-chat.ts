import { z } from "zod";

import { allowPortfolioChat } from "@shared/cache";
import { buildPublicPortfolioKnowledge, usernameSchema } from "@shared/lib/profiles";
import { readPublicProfileByUsername } from "@shared/services/published-profile";

import { env } from "@/env";

export const portfolioChatInput = z.object({
  category: z.string().max(50).optional(),
  content: z.string().trim().min(1).max(2000),
  type: z.enum(["cv", "referral"]),
});
const session = z.uuid();
/** Resolve data on the server for every request, including after unpublishing. */
export async function requireLegacyChat(username: string, sessionId: string) {
  const validUsername = usernameSchema.parse(username);
  session.parse(sessionId);
  const snapshot = await readPublicProfileByUsername(validUsername);
  // The paid multiuser launch belongs to the later entitlement/widget steps.
  if (snapshot?.id !== "main") throw new Error("Portfolio chat is not available.");
  const knowledge = buildPublicPortfolioKnowledge(snapshot);
  if (!knowledge) throw new Error("Portfolio chat is not available.");
  if (!env.OPENAI_API_KEY || !env.REDIS_URL || !env.REDIS_TOKEN)
    throw new Error("Portfolio chat is not configured.");
  if (!(await allowPortfolioChat(snapshot.id, sessionId)))
    throw new Error("Portfolio chat limit reached. Please try later.");
  return { knowledge, snapshot };
}

/** Recheck permission after a non-streaming answer without reserving another attempt. */
export async function assertCurrentPublication(
  username: string,
  id: string | undefined,
  revision: number,
) {
  const latest = await readPublicProfileByUsername(username);
  if (!latest?.isPublic || latest.id !== id || latest.revision !== revision)
    throw new Error("The published portfolio changed. Reload before asking again.");
}
