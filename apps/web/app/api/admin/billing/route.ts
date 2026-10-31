import { AuthAccessError, requireConfirmedUser } from "@shared/auth";
import { type BillingClient, BillingRepository } from "@shared/lib/billing-repository";
import { createServerClient } from "@shared/lib/supabase";
import { ZodError, z } from "zod";

import { sameOrigin } from "../../../../lib/admin-auth";

const headers = { "Cache-Control": "private, no-store" };
const assignment = z
  .object({
    chatEnabled: z.boolean().default(false),
    profileId: z.string().min(1).max(100).nullable(),
  })
  .strict();
async function session() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(client);
  return { repository: new BillingRepository(client as unknown as BillingClient), user };
}
export async function GET() {
  try {
    const { user, repository } = await session();
    return Response.json(await repository.summary(user.id), { headers });
  } catch (error) {
    return failure(error);
  }
}
export async function PUT(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const { user, repository } = await session();
    const raw = await request.text();
    if (raw.length > 1024)
      return Response.json({ error: "Request too large." }, { headers, status: 413 });
    const input = assignment.parse(JSON.parse(raw));
    await repository.assign(user.id, input.profileId, input.chatEnabled);
    return Response.json({ saved: true }, { headers });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof AuthAccessError)
    return Response.json({ error: "Sign in to access billing." }, { headers, status: 403 });
  if (error instanceof ZodError || error instanceof SyntaxError)
    return Response.json({ error: "Invalid assignment." }, { headers, status: 400 });
  return Response.json(
    { error: "Billing unavailable or assignment denied." },
    { headers, status: 503 },
  );
}
