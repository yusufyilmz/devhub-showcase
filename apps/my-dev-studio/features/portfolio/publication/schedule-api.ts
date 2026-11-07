import { ZodError, z } from "zod";

import { ProfileAccessError } from "@shared/services/profile";

import { env } from "@/env";
import { requireWorkspace, sameOrigin } from "@/features/admin/admin-auth";
import { managedRepository } from "@/features/management/managed-portfolios";

const headers = { "Cache-Control": "private, no-store" };
const scheduleInput = z
  .object({
    revision: z.number().int().min(1),
    runAt: z.iso.datetime({ offset: true }),
    timezone: z.string().min(1).max(100),
  })
  .strict();
const cancelInput = z.object({ scheduleId: z.uuid() }).strict();
type ScheduleClient = Awaited<ReturnType<typeof requireWorkspace>>["client"];

async function operation(request: Request, client: ScheduleClient, profileId: string) {
  if (request.method === "GET")
    return client.rpc("portfolio_schedule_status", { profile_id: profileId });
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 1024) throw new RangeError("Request too large.");
  if (request.method === "DELETE") {
    const input = cancelInput.parse(JSON.parse(body));
    return client.rpc("cancel_portfolio_schedule", {
      profile_id: profileId,
      schedule_id: input.scheduleId,
    });
  }
  const input = scheduleInput.parse(JSON.parse(body));
  if (!env.CRON_SECRET || env.CRON_SECRET.length < 32 || !env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Scheduler setup required");
  return client.rpc("schedule_portfolio_publication", {
    expected_revision: input.revision,
    profile_id: profileId,
    run_at: input.runAt,
    timezone: input.timezone,
  });
}
function databaseFailure(code: string) {
  if (code === "42501")
    return Response.json({ error: "Schedule access denied." }, { headers, status: 403 });
  if (code === "40001")
    return Response.json(
      { error: "Saved revision changed. Refresh and review again." },
      { headers, status: 409 },
    );
  if (code === "22023")
    return Response.json(
      { error: "Choose a valid timezone and a time from one minute to one year ahead." },
      { headers, status: 400 },
    );
  return Response.json(
    { error: "Schedule storage is unavailable. Refresh before retrying." },
    { headers, status: 503 },
  );
}
function failure(error: unknown) {
  if (error instanceof ProfileAccessError) return databaseFailure("42501");
  if (error instanceof RangeError)
    return Response.json({ error: "Request too large." }, { headers, status: 413 });
  if (error instanceof ZodError || error instanceof SyntaxError)
    return Response.json({ error: "Invalid schedule request." }, { headers, status: 400 });
  return Response.json(
    {
      error:
        "Scheduler unavailable. Refresh before retrying; ask the administrator to verify scheduler setup.",
    },
    { headers, status: 503 },
  );
}
export async function publicationSchedule(request: Request, id?: string) {
  if (!["GET", "POST", "DELETE"].includes(request.method))
    return Response.json({ error: "Method unavailable." }, { headers, status: 405 });
  if (request.method !== "GET" && !sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const { client, repository } = await (id ? managedRepository(id) : requireWorkspace());
    const snapshot = await repository.read();
    if (!snapshot?.id)
      return Response.json({ error: "Profile unavailable." }, { headers, status: 404 });
    const result = await operation(request, client, snapshot.id);
    if (result.error) return databaseFailure(result.error.code);
    return Response.json({ result: result.data }, { headers });
  } catch (error) {
    return failure(error);
  }
}
