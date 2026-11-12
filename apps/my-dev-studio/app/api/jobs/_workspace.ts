import { z } from "zod";

import { applicationDraft, prepareJobApplication } from "@shared/assistant";
import { allowStudioAssistant } from "@shared/lib/cache";
import {
  applicationStatuses,
  jobFilters,
  listingSchema,
  savedJobSearch,
} from "@shared/lib/services/jobs";
import type { Json } from "@shared/lib/types";
import { subscriptionFingerprint, validatePushSubscription } from "@shared/notifications/server";

import type { requireWorkspace } from "@/features/admin/admin-auth";

import { cvResponse } from "../cv/_response";
import { jobsPushConfig, jobsServiceClient } from "./_config";
import { cvEvidence } from "./_cv-evidence";

type Workspace = Awaited<ReturnType<typeof requireWorkspace>>;
const jobId = z.string().regex(/^[0-9a-f]{64}$/);
const storedDraft = applicationDraft.extend({ cvRevision: z.number().int() });
const matchExplanation = z.object({
  matchedSkills: z.array(z.string()),
  missingRequirements: z.array(z.string()),
  reason: z.string(),
});

const commandSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("search"), id: z.uuid().optional(), search: savedJobSearch }),
  z.object({ action: z.literal("delete"), id: z.uuid() }),
  z.object({ action: z.literal("state"), id: jobId, state: z.enum(["new", "saved", "dismissed"]) }),
  z.object({ action: z.literal("application"), id: jobId, status: z.enum(applicationStatuses) }),
  z.object({ action: z.literal("open"), id: jobId }),
  z.object({ action: z.literal("draft"), id: jobId }),
  z.object({ action: z.literal("editDraft"), draft: applicationDraft, id: jobId }),
  z.object({ action: z.literal("subscribe"), subscription: z.unknown() }),
  z.object({ action: z.literal("unsubscribe"), endpoint: z.url().max(2048) }),
]);

export class JobsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function dataOrThrow<T>(result: { data: T; error: null } | { error: unknown }) {
  if (result.error || !("data" in result)) throw new JobsError("Job storage is unavailable.", 503);
  return result.data;
}
function requireRecord<T>(value: T | null) {
  if (!value) throw new JobsError("This item is unavailable.", 404);
  return value;
}

export async function loadJobs({ client, user }: Workspace) {
  const owner = user.id;
  const [searches, matches, saved, runs, applications] = await Promise.all([
    client
      .from("job_searches")
      .select("id,name,filters,hours,threshold,enabled,due_at")
      .eq("user_id", owner)
      .order("name"),
    client
      .from("job_matches")
      .select("listing_id,score,explanation,state,notified_at,created_at")
      .eq("user_id", owner)
      .order("created_at", { ascending: false })
      .limit(250),
    client
      .from("job_matches")
      .select("listing_id,score,explanation,state,notified_at,created_at")
      .eq("user_id", owner)
      .eq("state", "saved")
      .order("created_at", { ascending: false }),
    client
      .from("job_scan_runs")
      .select("id,search_id,created_at,examined,matched,issues")
      .eq("user_id", owner)
      .order("created_at", { ascending: false })
      .limit(25),
    client
      .from("job_applications")
      .select("listing_id,status,draft,updated_at")
      .eq("user_id", owner)
      .order("updated_at", { ascending: false }),
  ]);
  const matchesData = [
    ...new Map(
      [...dataOrThrow(matches), ...dataOrThrow(saved)].map((row) => [row.listing_id, row]),
    ).values(),
  ];
  const applicationsData = dataOrThrow(applications);
  const ids = [
    ...new Set([...matchesData, ...applicationsData].map(({ listing_id }) => listing_id)),
  ];
  const listings: { id: string; listing: Json }[] = [];
  for (let start = 0; start < ids.length; start += 100) {
    listings.push(
      ...dataOrThrow(
        await client
          .from("job_listings")
          .select("id,listing")
          .eq("user_id", owner)
          .in("id", ids.slice(start, start + 100)),
      ),
    );
  }
  const listingById = new Map(
    listings.map(({ id, listing }) => [id, listingSchema.parse(listing)]),
  );
  return {
    applications: applicationsData.flatMap(({ listing_id: id, draft, ...application }) => {
      const listing = listingById.get(id);
      return listing
        ? [{ draft: storedDraft.safeParse(draft).data ?? null, id, listing, ...application }]
        : [];
    }),
    jobs: matchesData.flatMap(({ listing_id: id, explanation, ...match }) => {
      const listing = listingById.get(id);
      return listing
        ? [{ explanation: matchExplanation.parse(explanation), id, listing, ...match }]
        : [];
    }),
    pushPublicKey: jobsPushConfig()?.publicKey ?? null,
    runs: dataOrThrow(runs),
    searches: dataOrThrow(searches).map((search) => ({
      ...search,
      filters: jobFilters.safeParse(search.filters).data,
    })),
  };
}

async function findListing({ client, user }: Workspace, id: string) {
  const row = requireRecord(
    dataOrThrow<{ listing: Json } | null>(
      await client
        .from("job_listings")
        .select("listing")
        .eq("user_id", user.id)
        .eq("id", id)
        .maybeSingle(),
    ),
  );
  return listingSchema.parse(row.listing);
}

async function writeApplication(
  { client }: Workspace,
  id: string,
  change: { status?: (typeof applicationStatuses)[number]; draft?: Json },
  overwrite: boolean,
) {
  // The database defaults user_id from auth.uid(). Only the supplied fields may change on conflict.
  if (overwrite) {
    dataOrThrow(
      await client
        .from("job_applications")
        .upsert({ listing_id: id, ...change }, { onConflict: "user_id,listing_id" }),
    );
  } else {
    dataOrThrow(
      await client
        .from("job_applications")
        .upsert(
          { listing_id: id, ...change },
          { ignoreDuplicates: true, onConflict: "user_id,listing_id" },
        ),
    );
  }
}

async function draftApplication(workspace: Workspace, id: string, signal: AbortSignal) {
  const [job, snapshot] = await Promise.all([
    findListing(workspace, id),
    workspace.repository.read(),
  ]);
  const cv = snapshot && cvEvidence(snapshot.profile);
  if (!snapshot || !cv) throw new JobsError("Add CV experience or skills before drafting.", 422);
  if (!(await allowStudioAssistant(workspace.user.id)))
    throw new JobsError("Assistant attempt limit reached.", 429);
  const draft = await prepareJobApplication(
    {
      cv,
      job: { company: job.company, description: job.description, title: job.title },
    },
    signal,
  );
  await writeApplication(
    workspace,
    id,
    { draft: { ...draft, cvRevision: snapshot.revision } },
    true,
  );
}

async function storeDevice(
  workspace: Workspace,
  command: Extract<z.infer<typeof commandSchema>, { action: "subscribe" | "unsubscribe" }>,
) {
  const client = jobsServiceClient();
  const owner = workspace.user.id;
  if (command.action === "unsubscribe") {
    dataOrThrow(
      await client
        .from("job_push_devices")
        .delete()
        .eq("user_id", owner)
        .eq("id", subscriptionFingerprint(command.endpoint)),
    );
    return;
  }
  if (!jobsPushConfig()) throw new JobsError("Browser push is unavailable.", 503);
  const parsed = z
    .unknown()
    .transform((input, ctx) => {
      try {
        return validatePushSubscription(input);
      } catch {
        ctx.addIssue({ code: "custom", message: "Unsupported browser push subscription." });
        return z.NEVER;
      }
    })
    .parse(command.subscription);
  const id = subscriptionFingerprint(parsed.endpoint);
  dataOrThrow(
    await client
      .from("job_push_devices")
      .upsert(
        { id, subscription: parsed, user_id: owner },
        { ignoreDuplicates: true, onConflict: "id" },
      ),
  );
  const updated = await client
    .from("job_push_devices")
    .update({ subscription: parsed })
    .eq("id", id)
    .eq("user_id", owner)
    .select("id")
    .maybeSingle();
  if (!dataOrThrow(updated))
    throw new JobsError("This device subscription is already registered.", 409);
}

export async function changeJobs(workspace: Workspace, input: unknown, signal: AbortSignal) {
  const command = commandSchema.parse(input);
  const { client, user } = workspace;
  switch (command.action) {
    case "search":
      if (command.id) {
        requireRecord(
          dataOrThrow(
            await client
              .from("job_searches")
              .update(command.search)
              .eq("user_id", user.id)
              .eq("id", command.id)
              .select("id")
              .maybeSingle(),
          ),
        );
      } else {
        dataOrThrow(await client.from("job_searches").insert(command.search));
      }
      break;
    case "delete":
      requireRecord(
        dataOrThrow(
          await client
            .from("job_searches")
            .delete()
            .eq("user_id", user.id)
            .eq("id", command.id)
            .select("id")
            .maybeSingle(),
        ),
      );
      break;
    case "state":
      requireRecord(
        dataOrThrow(
          await client
            .from("job_matches")
            .update({ state: command.state })
            .eq("user_id", user.id)
            .eq("listing_id", command.id)
            .select("listing_id")
            .maybeSingle(),
        ),
      );
      break;
    case "application":
      await findListing(workspace, command.id);
      await writeApplication(workspace, command.id, { status: command.status }, true);
      break;
    case "open": {
      const job = await findListing(workspace, command.id);
      await writeApplication(workspace, command.id, { status: "opened" }, false);
      dataOrThrow(
        await client
          .from("job_applications")
          .update({ status: "opened" })
          .eq("user_id", user.id)
          .eq("listing_id", command.id)
          .eq("status", "preparing"),
      );
      return { url: job.url };
    }
    case "draft":
      await draftApplication(workspace, command.id, signal);
      break;
    case "editDraft": {
      const { draft } = requireRecord(
        dataOrThrow(
          await client
            .from("job_applications")
            .select("draft")
            .eq("user_id", user.id)
            .eq("listing_id", command.id)
            .maybeSingle(),
        ),
      );
      const previous = storedDraft.parse(requireRecord(draft));
      requireRecord(
        dataOrThrow(
          await client
            .from("job_applications")
            .update({ draft: { ...command.draft, cvRevision: previous.cvRevision } })
            .eq("user_id", user.id)
            .eq("listing_id", command.id)
            .select("listing_id")
            .maybeSingle(),
        ),
      );
      break;
    }
    case "subscribe":
    case "unsubscribe":
      await storeDevice(workspace, command);
      break;
  }
  return { ok: true };
}

export async function jobCv(workspace: Workspace, input: string | null) {
  const snapshot = requireRecord(await workspace.repository.read());
  if (input === null) return cvResponse(snapshot);
  const id = jobId.parse(input);
  const { draft } = requireRecord(
    dataOrThrow(
      await workspace.client
        .from("job_applications")
        .select("draft")
        .eq("user_id", workspace.user.id)
        .eq("listing_id", id)
        .maybeSingle(),
    ),
  );
  const prepared = storedDraft.parse(requireRecord(draft));
  if (prepared.cvRevision !== snapshot.revision)
    throw new JobsError("Your CV changed. Prepare a fresh application draft.", 409);
  return cvResponse({ ...snapshot, profile: { ...snapshot.profile, summary: prepared.summary } });
}
