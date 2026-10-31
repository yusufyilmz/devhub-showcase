import { allowStudioAssistant } from "@shared/cache";
import { PortfolioEditModel } from "@shared/chat";
import { aiEditRequestSchema, serializeAiEditContext } from "@shared/lib/ai-edit";
import { runPremiumOperation } from "@shared/lib/billing";
import {
  type BillingClient,
  BillingRepository,
  PremiumUsageRepository,
} from "@shared/lib/billing-repository";
import { buildOwnerPortfolioKnowledge } from "@shared/lib/portfolio-knowledge";
import { ProfileAccessError, ProfileConflictError } from "@shared/lib/profile-errors";
import { ZodError } from "zod";

import { requireWorkspace, sameOrigin } from "../../../../lib/admin-auth";
import { billingServiceClient } from "../../../../lib/billing/client";

export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store" };
function configured() {
  return Boolean(
    process.env.OPENAI_API_KEY &&
      process.env.REDIS_URL &&
      process.env.REDIS_TOKEN &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
async function workspace() {
  const result = await requireWorkspace();
  const snapshot = await result.repository.read();
  if (!snapshot?.id) throw new ProfileAccessError();
  return { ...result, snapshot };
}
export async function GET() {
  try {
    const { client, user, snapshot } = await workspace();
    const billing = await new BillingRepository(client as unknown as BillingClient).summary(
      user.id,
    );
    return Response.json(
      {
        enabled:
          configured() &&
          billing.plan === "pro" &&
          billing.assignedProfileId === snapshot.id &&
          billing.limits.studio_assistant > billing.usage.studio_assistant,
        limit: billing.limits.studio_assistant,
        usage: billing.usage.studio_assistant,
      },
      { headers },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const { user, snapshot, repository, service, client } = await workspace();
    if (!configured()) throw new Error("Unavailable");
    const raw = await readBody(request);
    const input = aiEditRequestSchema.parse(JSON.parse(raw));
    if (input.profileId !== snapshot.id) throw new ProfileAccessError();
    if (input.revision !== snapshot.revision) throw new ProfileConflictError();
    serializeAiEditContext(input.draft);
    const billing = await new BillingRepository(client as unknown as BillingClient).summary(
      user.id,
    );
    if (
      billing.plan !== "pro" ||
      billing.assignedProfileId !== snapshot.id ||
      billing.usage.studio_assistant >= billing.limits.studio_assistant
    )
      throw new Error("Premium access unavailable.");
    if (!(await allowStudioAssistant(user.id)))
      return Response.json(
        { error: "Assistant request limit reached. Please try later." },
        { headers, status: 429 },
      );
    const usage = new PremiumUsageRepository(billingServiceClient() as unknown as BillingClient);
    const proposal = await runPremiumOperation(
      usage,
      {
        accountId: user.id,
        feature: "studio_assistant",
        profileId: snapshot.id,
        requestId: input.requestId,
      },
      () =>
        new PortfolioEditModel().propose(
          buildOwnerPortfolioKnowledge({ ...snapshot, profile: input.draft }),
          input.message,
          AbortSignal.any([request.signal, AbortSignal.timeout(45000)]),
        ),
    );
    await service.requireOwner(user.id);
    const latest = await repository.read();
    if (!latest || latest.revision !== snapshot.revision) throw new ProfileConflictError();
    return Response.json({ proposal, revision: snapshot.revision }, { headers });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof RangeError)
    return Response.json({ error: "Draft too large for the assistant." }, { headers, status: 413 });
  if (error instanceof ProfileAccessError)
    return Response.json(
      { error: "Only the owner can use this assistant." },
      { headers, status: 403 },
    );
  if (error instanceof ProfileConflictError)
    return Response.json({ error: error.message }, { headers, status: 409 });
  if (error instanceof ZodError || error instanceof SyntaxError)
    return Response.json(
      { error: "Invalid draft or proposal. Check your details and try again." },
      { headers, status: 400 },
    );
  return Response.json(
    { error: "Assistant unavailable or Pro allowance exhausted. Your draft has not been changed." },
    { headers, status: 503 },
  );
}

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing request.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) break;
    bytes += result.value.byteLength;
    if (bytes > 250000) {
      await reader.cancel();
      throw new RangeError("Too large");
    }
    chunks.push(result.value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
