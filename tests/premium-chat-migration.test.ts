import { readdirSync, readFileSync } from "node:fs";

import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("requires owner opt-in inside the atomic reservation RPC", async () => {
  const db = new PGlite();
  const account = "11111111-1111-4111-8111-111111111111";
  try {
    await db.exec(
      `create schema auth;create role anon;create role authenticated;create role service_role bypassrls;grant usage on schema public,auth to authenticated,service_role;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create table public.portfolio_profiles(id text primary key,owner_id uuid,is_public boolean);grant select on public.portfolio_profiles to authenticated;`,
    );
    for (const suffix of ["_premium_entitlements.sql", "_premium_chat_widget.sql"]) {
      const file = readdirSync("supabase/migrations").find((n) => n.endsWith(suffix));
      if (!file) throw new Error("Missing migration");
      await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
    }
    await db.query("insert into auth.users values ($1)", [account]);
    await db.query("insert into public.portfolio_profiles values ('alpha',$1,true)", [account]);
    await db.query(
      "insert into public.billing_entitlements values($1,'pro','active',now()-interval '1 day',now()+interval '29 days',100,10)",
      [account],
    );
    await db.exec("set role authenticated");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [account]);
    await db.query(
      "insert into public.billing_assignments(account_id,profile_id) values($1,'alpha')",
      [account],
    );
    await db.exec("reset role;set role service_role");
    const reserve = async () =>
      (
        await db.query<{ ok: boolean }>(
          "select public.reserve_premium_usage($1,'alpha','portfolio_chat',$2) ok",
          [account, crypto.randomUUID()],
        )
      ).rows[0]?.ok;
    expect(await reserve()).toBe(false);
    await db.exec(
      "reset role;set role authenticated;update public.billing_assignments set chat_enabled=true",
    );
    await db.exec("reset role;set role service_role");
    expect(await reserve()).toBe(true);
    await db.exec(
      "reset role;set role authenticated;update public.billing_assignments set chat_enabled=false",
    );
    await db.exec("reset role;set role service_role");
    expect(await reserve()).toBe(false);
    expect((await db.query("select * from public.billing_usage")).rows).toHaveLength(1);
  } finally {
    await db.close();
  }
}, 20000);
