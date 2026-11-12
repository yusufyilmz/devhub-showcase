import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

const owner = "741fc347-441a-4331-9281-16c841164734";
const other = "741fc347-441a-4331-9281-16c841164735";
const token = "4f98492f-e7f9-4e11-bcaa-b045e32d8240";
const job = "a".repeat(64);
const candidates = JSON.stringify([
  {
    id: job,
    listing: { sourceId: "123", title: "Engineer", url: "https://www.linkedin.com/jobs/view/123/" },
  },
]);

describe("LinkedIn forwarding database", () => {
  it("verifies the account email and isolates, deduplicates and saves imports", async () => {
    const db = new PGlite();
    try {
      await db.exec(`
        create role anon; create role authenticated; create role service_role bypassrls;
        create schema auth;
        create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
        create function auth.uid() returns uuid language sql stable as $$
          select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
        $$;
        grant usage on schema auth to authenticated, service_role, anon;
      `);
      for (const migration of [
        "20261112174836_job_hunter",
        "20261112192628_linkedin_alert_import",
      ]) {
        await db.exec(readFileSync(`supabase/migrations/${migration}.sql`, "utf8"));
      }
      await db.query(
        "insert into auth.users values ($1, 'owner@example.test', now()), ($2, 'other@example.test', now())",
        [owner, other],
      );
      await db.query("insert into public.job_alert_addresses values ($1,$2)", [owner, token]);
      await db.exec("set role service_role");
      const enqueue = "select public.enqueue_linkedin_alert($1,$2,$3) as count";
      expect((await db.query(enqueue, [token, "other@example.test", candidates])).rows).toEqual([
        { count: 0 },
      ]);
      expect((await db.query(enqueue, [token, "OWNER@example.test", candidates])).rows).toEqual([
        { count: 1 },
      ]);
      expect((await db.query(enqueue, [token, "owner@example.test", candidates])).rows).toEqual([
        { count: 0 },
      ]);

      await db.exec("set role authenticated");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [other]);
      expect((await db.query("select id from public.job_alert_imports")).rows).toEqual([]);
      expect((await db.query("select token from public.job_alert_addresses")).rows).toEqual([]);
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [owner]);
      expect((await db.query("select id from public.job_alert_imports")).rows).toEqual([
        { id: job },
      ]);

      await db.exec("set role service_role");
      const accept = "select public.accept_linkedin_alert($1,$2,$3,null,0,'{}') as accepted";
      expect((await db.query(accept, [other, job, '{"title":"Engineer"}'])).rows).toEqual([
        { accepted: false },
      ]);
      expect((await db.query(accept, [owner, job, '{"title":"Engineer"}'])).rows).toEqual([
        { accepted: true },
      ]);
      expect((await db.query("select state, score from public.job_matches")).rows).toEqual([
        { score: null, state: "saved" },
      ]);
      expect((await db.query(enqueue, [token, "owner@example.test", candidates])).rows).toEqual([
        { count: 0 },
      ]);
    } finally {
      await db.close();
    }
  });
});
