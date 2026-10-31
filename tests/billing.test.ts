import { readdirSync, readFileSync } from "node:fs";

import { PGlite } from "@electric-sql/pglite";
import { expect, it, vi } from "vitest";

import { entitlementSummary, runPremiumOperation } from "../packages/lib/src/billing";

it("defaults to Free and never invokes a provider when reservation fails", async () => {
  expect(entitlementSummary(null).limits.portfolio_chat).toBe(0);
  const operation = vi.fn();
  await expect(
    runPremiumOperation(
      { finish: async () => {}, reserve: async () => false },
      {
        accountId: "11111111-1111-4111-8111-111111111111",
        feature: "portfolio_chat",
        profileId: "alpha",
        requestId: crypto.randomUUID(),
      },
      operation,
    ),
  ).rejects.toThrow();
  expect(operation).not.toHaveBeenCalled();
});
it("executes billing permissions, ownership, quotas and rollover against PostgreSQL", async () => {
  const db = new PGlite();
  const a = "11111111-1111-4111-8111-111111111111";
  const b = "22222222-2222-4222-8222-222222222222";
  try {
    await db.exec(`create schema auth; create role anon; create role authenticated; create role service_role bypassrls;
 grant usage on schema public,auth to anon,authenticated,service_role;
 create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create table public.portfolio_profiles(id text primary key,owner_id uuid,is_public boolean);
 alter table public.portfolio_profiles enable row level security;
 grant select on public.portfolio_profiles to authenticated;
 create policy own on public.portfolio_profiles for select to authenticated using(owner_id=(select auth.uid()) or is_public);`);
    const file = readdirSync("supabase/migrations").find((n) =>
      n.endsWith("_premium_entitlements.sql"),
    );
    if (!file) throw new Error("Missing migration");
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
    await db.query("insert into auth.users values ($1),($2)", [a, b]);
    await db.query(
      "insert into public.portfolio_profiles values ('alpha',$1,true),('beta',$2,true),('managed',null,true)",
      [a, b],
    );
    await db.query(
      "insert into public.billing_entitlements values ($1,'pro','active',now()-interval '1 day',now()+interval '29 days',2,1)",
      [a],
    );
    await db.exec("set role authenticated");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [a]);
    await db.query("insert into public.billing_assignments values ($1,'alpha')", [a]);
    await expect(
      db.exec("update public.billing_assignments set profile_id='beta'"),
    ).rejects.toThrow();
    await expect(
      db.exec("update public.billing_assignments set profile_id='managed'"),
    ).rejects.toThrow();
    await expect(
      db.exec("update public.billing_entitlements set chat_limit=999"),
    ).rejects.toThrow();
    const id = crypto.randomUUID();
    const reserve = async (requestId = id, feature = "portfolio_chat") =>
      (
        await db.query<{ allowed: boolean }>(
          "select public.reserve_premium_usage($1,'alpha',$2,$3) as allowed",
          [a, feature, requestId],
        )
      ).rows[0]?.allowed;
    await expect(reserve()).rejects.toThrow();
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [b]);
    expect((await db.query("select * from public.billing_entitlements")).rows).toEqual([]);
    await db.exec("reset role; set role anon");
    await expect(db.exec("select * from public.billing_usage")).rejects.toThrow();
    await db.exec("reset role; set role service_role");
    expect(await reserve()).toBe(true);
    expect(await reserve()).toBe(false);
    expect(await reserve(crypto.randomUUID())).toBe(true);
    expect(await reserve(crypto.randomUUID())).toBe(false);
    expect(await reserve(crypto.randomUUID(), "studio_assistant")).toBe(true);
    expect(await reserve(crypto.randomUUID(), "studio_assistant")).toBe(false);
    await db.exec("update public.billing_entitlements set period_start=now()-interval '1 hour'");
    expect(await reserve(crypto.randomUUID())).toBe(true);
    await db.exec("update public.billing_entitlements set status='past_due'");
    expect(await reserve(crypto.randomUUID())).toBe(false);
    await db.exec(
      "update public.billing_entitlements set status='active'; update public.portfolio_profiles set is_public=false where id='alpha'",
    );
    expect(await reserve(crypto.randomUUID())).toBe(false);
    await db.exec("update public.portfolio_profiles set owner_id=null where id='alpha'");
    expect(await reserve(crypto.randomUUID(), "studio_assistant")).toBe(false);
  } finally {
    await db.close();
  }
}, 20000);
