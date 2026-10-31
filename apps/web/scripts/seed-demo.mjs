import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

import { createClient } from "@supabase/supabase-js";

import demoProfile from "../../../packages/content/src/demo-profile.json" with { type: "json" };

export function assertEmptyDemoAccount(user, row, entitlement) {
  if (
    !user?.email_confirmed_at ||
    !user.identities?.some((identity) => identity.provider === "google")
  )
    throw new Error("Sign in with a separate verified Google account first.");
  if (
    !row ||
    row.id === "main" ||
    row.owner_id !== user.id ||
    row.is_public ||
    row.revision !== 1 ||
    row.document?.templateChosen !== false ||
    row.document?.experiences?.length ||
    row.document?.projects?.length
  )
    throw new Error(
      "Demo setup requires an untouched private starter portfolio. Existing content will not be overwritten.",
    );
  if (entitlement) throw new Error("Existing billing grants will not be overwritten.");
}
export async function seedDemo(client, ownerId, { apply = false, grantPro = false } = {}) {
  const auth = await client.auth.admin.getUserById(ownerId);
  if (auth.error) throw new Error("Could not read demo identity.");
  const profile = await client
    .from("portfolio_profiles")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();
  const billing = await client
    .from("billing_entitlements")
    .select("account_id")
    .eq("account_id", ownerId)
    .maybeSingle();
  if (profile.error || billing.error)
    throw new Error("Could not read demo setup. Apply billing migrations first.");
  assertEmptyDemoAccount(auth.data.user, profile.data, billing.data);
  if (!apply) return { grantPro, mode: "dry-run", private: true, profileId: profile.data.id };
  const result = await client
    .from("portfolio_profiles")
    .update({ document: demoProfile, revision: 2, updated_at: new Date().toISOString() })
    .eq("id", profile.data.id)
    .eq("owner_id", ownerId)
    .eq("revision", 1)
    .eq("is_public", false)
    .select("id,username")
    .single();
  if (result.error) throw new Error("Demo profile changed concurrently; no overwrite was made.");
  if (grantPro) {
    const now = new Date();
    const end = new Date(now.getTime() + 7 * 86400000);
    const grant = await client.from("billing_entitlements").insert({
      account_id: ownerId,
      chat_limit: 20,
      editor_limit: 5,
      period_end: end.toISOString(),
      period_start: now.toISOString(),
      plan: "pro",
      status: "active",
    });
    if (grant.error)
      throw new Error(
        "Private demo created but Pro setup failed. Inspect billing manually; do not reset an existing account.",
      );
    const assignment = await client
      .from("billing_assignments")
      .insert({ account_id: ownerId, chat_enabled: false, profile_id: profile.data.id });
    if (assignment.error)
      throw new Error("Demo grant created but assignment failed. Review billing manually.");
  }
  return {
    grantPro,
    mode: "created",
    private: true,
    profileId: result.data.id,
    username: result.data.username,
  };
}
async function main() {
  const { values } = parseArgs({
    options: {
      apply: { type: "boolean" },
      "grant-pro": { type: "boolean" },
      "owner-id": { type: "string" },
    },
  });
  if (!/^[0-9a-f-]{36}$/i.test(values["owner-id"] || ""))
    throw new Error("Provide --owner-id UUID.");
  if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_"))
    throw new Error("Demo provisioning requires Stripe test configuration.");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Missing server Supabase configuration.");
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const result = await seedDemo(client, values["owner-id"], {
    apply: values.apply,
    grantPro: values["grant-pro"],
  });
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(() => {
    process.stderr.write(
      "Demo setup failed. Check the account is a verified empty starter and inspect storage before retrying. No credentials are printed.",
    );
    process.exitCode = 1;
  });
