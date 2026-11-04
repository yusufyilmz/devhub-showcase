import { z } from "zod";

import type { SupabaseDbClient } from "@shared/lib/types";
import { ProfileAccessError } from "@shared/services/profile";
import type { SupportAccount, SupportSummary } from "@shared/ui/support";

import { sameOrigin } from "@/features/admin/admin-auth";
import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

const headers = { "Cache-Control": "private, no-store" };
const accountSchema = z
  .object({ confirmed: z.boolean(), created_at: z.string(), id: z.uuid() })
  .strict();
const reason = z.enum(["customer_request", "incident_response", "configuration_review"]);
const summarySchema = accountSchema
  .extend({
    audit: z.array(
      z
        .object({
          action: z.literal("disable_visitor_chat"),
          actor_id: z.uuid(),
          after_enabled: z.literal(false),
          before_enabled: z.boolean(),
          created_at: z.string(),
          reason,
          request_id: z.uuid(),
        })
        .strict(),
    ),
    billing: z
      .object({
        active: z.boolean(),
        chatEnabled: z.boolean(),
        chatLimit: z.number(),
        chatUsed: z.number(),
        editorLimit: z.number(),
        editorUsed: z.number(),
        periodEnd: z.string().optional(),
        plan: z.enum(["free", "pro"]),
        status: z.enum(["inactive", "active", "trialing", "past_due", "canceled"]),
      })
      .strict(),
    profiles: z.array(
      z
        .object({
          cvPublished: z.boolean(),
          id: z.string(),
          revision: z.number().int(),
          websitePublished: z.boolean(),
        })
        .strict(),
    ),
  })
  .strict();
const actionSchema = z
  .object({
    account: z.uuid(),
    action: z.literal("disable_visitor_chat"),
    confirmed: z.literal(true),
    reason,
    requestId: z.uuid(),
  })
  .strict();
class SupportFailure extends Error {
  constructor(readonly status: number) {
    super("Support unavailable");
  }
}
function checked(result: { data: unknown; error: { code?: string } | null }) {
  if (result.error)
    throw new SupportFailure(
      result.error.code === "42501" ? 403 : result.error.code === "P0002" ? 404 : 503,
    );
  return result.data;
}
async function read(client: SupabaseDbClient, url: URL) {
  if (url.searchParams.has("account")) {
    const account = z.uuid().parse(url.searchParams.get("account"));
    const result = checked(
      await client.rpc("support_account_summary", { target_account: account }),
    );
    const parsed = summarySchema.safeParse(result);
    if (!parsed.success) throw new SupportFailure(503);
    const summary: SupportSummary = parsed.data;
    return Response.json(summary, { headers });
  }
  const after = url.searchParams.has("after")
    ? z.uuid().parse(url.searchParams.get("after"))
    : undefined;
  const result = checked(
    await client.rpc("support_accounts", after ? { after_account: after } : {}),
  );
  const parsed = z.array(accountSchema).max(26).safeParse(result);
  if (!parsed.success) throw new SupportFailure(503);
  const accounts: SupportAccount[] = parsed.data.slice(0, 25);
  return Response.json(
    { accounts, ...(parsed.data.length > 25 ? { next: accounts.at(-1)?.id } : {}) },
    { headers },
  );
}
export async function supportRequest(request: Request) {
  if (request.method !== "GET" && !sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const { client } = await requirePortfolioAdmin();
    if (request.method === "GET") return await read(client, new URL(request.url));
    if (request.method !== "POST") throw new SupportFailure(405);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 2048) throw new SupportFailure(413);
    const input = actionSchema.parse(JSON.parse(raw));
    const data = checked(
      await client.rpc("support_disable_visitor_chat", {
        reason: input.reason,
        request_id: input.requestId,
        target_account: input.account,
      }),
    );
    const output = z.object({ changed: z.boolean(), requestId: z.uuid() }).strict().safeParse(data);
    if (!output.success) throw new SupportFailure(503);
    return Response.json({ result: output.data }, { headers });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  const status =
    error instanceof SupportFailure
      ? error.status
      : error instanceof z.ZodError || error instanceof SyntaxError
        ? 400
        : error instanceof ProfileAccessError
          ? 403
          : 503;
  const message =
    status === 403
      ? "Support administrator access required."
      : status === 400
        ? "Invalid support request."
        : "Support unavailable. Check setup and refresh before retrying.";
  return Response.json({ error: message }, { headers, status });
}
