import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

const admin = "11111111-1111-4111-8111-111111111111";
const owner = "22222222-2222-4222-8222-222222222222";
const outsider = "33333333-3333-4333-8333-333333333333";
const requestId = "44444444-4444-4444-8444-444444444444";

describe("account support database boundaries", () => {
  it("isolates metadata and commits a reasoned, replay-safe disable action without changing billing or content", async () => {
    const db = new PGlite();
    try {
      await db.exec(`create schema auth; create schema private;
        create role anon; create role authenticated; create role service_role bypassrls;
        grant usage on schema public,auth,private to anon,authenticated,service_role;
        create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,created_at timestamptz default now());
        create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
        create table private.portfolio_admins(user_id uuid primary key); alter table private.portfolio_admins enable row level security;
        revoke all on private.portfolio_admins from public,anon,authenticated;
        create table public.portfolio_profiles(id text primary key,owner_id uuid,is_public boolean,revision integer default 7,document jsonb default '{"private":"secret-CV-and-prompt"}');
        alter table public.portfolio_profiles enable row level security;
        create table public.portfolio_publications(id text primary key,document jsonb);
        create table public.portfolio_public_cvs(id text primary key,document jsonb);`);
      for (const file of [
        "20261031083830_premium_entitlements.sql",
        "20261031100944_premium_chat_widget.sql",
        "20261031084955_stripe_subscriptions.sql",
        "20261104183000_account_support.sql",
      ])
        await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
      await db.query(
        "insert into auth.users(id,email,email_confirmed_at) values($1,'admin@example.test',now()),($2,'private@example.test',now()),($3,'fitness-only@example.test',now())",
        [admin, owner, outsider],
      );
      await db.query("insert into private.portfolio_admins values($1)", [admin]);
      await db.query(
        "insert into public.portfolio_profiles(id,owner_id,is_public) values('alpha',$1,true)",
        [owner],
      );
      await db.exec(
        "insert into public.portfolio_publications values('alpha','{\"private\":\"secret-CV-and-prompt\"}')",
      );
      await db.query(
        "insert into public.billing_entitlements values($1,'pro','active',now()-interval '1 day',now()+interval '1 day',10,5)",
        [owner],
      );
      await db.query(
        "insert into public.billing_assignments(account_id,profile_id,chat_enabled) values($1,'alpha',true)",
        [owner],
      );
      await db.query(
        "insert into public.billing_usage(request_id,account_id,profile_id,feature,period_start,outcome) select $1,$2,'alpha','portfolio_chat',period_start,'failed' from public.billing_entitlements where account_id=$2",
        [crypto.randomUUID(), owner],
      );
      async function identity(id: string, role = "authenticated") {
        await db.exec(`reset role;set role ${role}`);
        await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
      }
      for (const id of [owner, outsider]) {
        await identity(id);
        await expect(db.query("select public.support_accounts()")).rejects.toThrow();
        await expect(
          db.query("select public.support_account_summary($1)", [owner]),
        ).rejects.toThrow();
        await expect(
          db.query("select public.support_disable_visitor_chat($1,$2,'customer_request')", [
            owner,
            requestId,
          ]),
        ).rejects.toThrow();
      }
      await identity("", "anon");
      await expect(db.query("select public.support_accounts()")).rejects.toThrow();
      await identity(admin);
      const listed = (
        await db.query<{ data: { id: string }[] }>("select public.support_accounts() data")
      ).rows[0]!.data;
      expect(listed.map((x) => x.id)).toEqual([owner]);
      await expect(db.query("select * from private.support_audit")).rejects.toThrow();
      const summary = async () =>
        (
          await db.query<{
            data: {
              billing: { chatEnabled: boolean; chatUsed: number; plan: string };
              audit: unknown[];
            };
          }>("select public.support_account_summary($1) data", [owner])
        ).rows[0]!.data;
      expect(JSON.stringify(await summary())).not.toMatch(
        /secret-CV|prompt|private@example|fitness-only/,
      );
      expect((await summary()).billing.chatUsed).toBe(1);
      await db.query("select public.support_disable_visitor_chat($1,$2,'customer_request')", [
        owner,
        requestId,
      ]);
      await db.query("select public.support_disable_visitor_chat($1,$2,'customer_request')", [
        owner,
        requestId,
      ]);
      const result = await summary();
      expect(result.billing.chatEnabled).toBe(false);
      expect(result.billing.plan).toBe("pro");
      expect(result.billing.chatUsed).toBe(1);
      expect(result.audit).toHaveLength(1);
      expect(result.audit[0]).toMatchObject({
        actor_id: admin,
        after_enabled: false,
        before_enabled: true,
        created_at: expect.any(String),
        reason: "customer_request",
        request_id: requestId,
      });
      await expect(
        db.query("select public.support_disable_visitor_chat($1,$2,'incident_response')", [
          owner,
          requestId,
        ]),
      ).rejects.toThrow();
      await expect(
        db.query("select public.support_disable_visitor_chat($1,$2,'grant_pro')", [
          owner,
          crypto.randomUUID(),
        ]),
      ).rejects.toThrow();
      await expect(
        db.query("update private.support_audit set reason='incident_response'"),
      ).rejects.toThrow();
      await db.exec("reset role");
      expect(
        (await db.query("select revision,document from public.portfolio_profiles")).rows,
      ).toEqual([{ document: { private: "secret-CV-and-prompt" }, revision: 7 }]);
      await db.exec(
        "update public.billing_assignments set chat_enabled=true; create function private.reject_support_audit() returns trigger language plpgsql as $$begin raise exception 'Fixture audit failure'; end$$; create trigger reject_support_audit before insert on private.support_audit for each row execute function private.reject_support_audit()",
      );
      await identity(admin);
      await expect(
        db.query("select public.support_disable_visitor_chat($1,$2,'incident_response')", [
          owner,
          crypto.randomUUID(),
        ]),
      ).rejects.toThrow();
      expect((await summary()).billing.chatEnabled).toBe(true);
      expect((await summary()).audit).toHaveLength(1);
      await db.exec("reset role");
      await db.query("update auth.users set email_confirmed_at=null where id=$1", [admin]);
      await identity(admin);
      await expect(db.query("select public.support_accounts()")).rejects.toThrow();
      await db.exec("reset role");
      await db.query("update auth.users set email_confirmed_at=now() where id=$1", [admin]);
      await db.query("insert into public.billing_customers(account_id) values($1)", [outsider]);
      await identity(admin);
      const billingOnly = (
        await db.query<{ data: { profiles: unknown[]; billing: { plan: string } } }>(
          "select public.support_account_summary($1) data",
          [outsider],
        )
      ).rows[0]!.data;
      expect(billingOnly.profiles).toEqual([]);
      expect(billingOnly.billing.plan).toBe("free");
      await db.exec("reset role");
      await db.query("delete from private.portfolio_admins where user_id=$1", [admin]);
      await identity(admin);
      await expect(
        db.query("select public.support_account_summary($1)", [owner]),
      ).rejects.toThrow();
    } finally {
      await db.close();
    }
  }, 20000);
});
