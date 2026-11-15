import { z } from "zod";

import { proposeInterviewPrep } from "@shared/assistant";
import { runPremiumOperation } from "@shared/billing";
import {
  type BillingClient,
  billingServiceClient,
  PremiumUsageRepository,
  premiumAiConfigured,
} from "@shared/billing/server";
import { allowStudioAssistant } from "@shared/lib/cache";
import { ProfileAccessError } from "@shared/lib/profile";

import { requireWorkspace, sameOrigin } from "@/features/admin/admin-auth";

export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store" };
const requestSchema = z.object({
  evidence: z
    .array(z.object({ facts: z.array(z.string().max(500)).max(8), title: z.string().max(400) }))
    .min(1)
    .max(10),
  job: z.string().trim().min(1).max(20_000),
  requestId: z.uuid(),
});

function error(message: string, status: number) {
  return Response.json({ error: message }, { headers, status });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return error("Invalid origin.", 403);
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]);
  try {
    const { repository, user } = await requireWorkspace();
    const snapshot = await repository.read();
    if (!snapshot?.id) throw new ProfileAccessError();
    if (!premiumAiConfigured()) return error("Interview prep is unavailable.", 503);

    const raw = await request.text();
    if (raw.length > 75_000) return error("Choose less CV evidence and try again.", 413);
    const { requestId, ...context } = requestSchema.parse(JSON.parse(raw));
    if (!(await allowStudioAssistant(user.id)))
      return error("Assistant attempt limit reached.", 429);

    const usage = new PremiumUsageRepository(billingServiceClient() as unknown as BillingClient);
    const prep = await runPremiumOperation(
      usage,
      {
        accountId: user.id,
        feature: "studio_assistant",
        profileId: snapshot.id,
        requestId,
        signal,
      },
      () => proposeInterviewPrep(context, signal),
    );
    return Response.json(prep, { headers });
  } catch (failure) {
    if (failure instanceof ProfileAccessError)
      return error("Sign in to prepare for an interview.", 403);
    if (failure instanceof z.ZodError || failure instanceof SyntaxError)
      return error("Enter a job description and select CV evidence.", 400);
    if (failure instanceof RangeError) return error("Choose less CV evidence and try again.", 413);
    return error("Interview prep is unavailable or your Pro allowance is exhausted.", 503);
  }
}
