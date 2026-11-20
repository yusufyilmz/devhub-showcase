import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

const owner = "741fc347-441a-4331-9281-16c841164734";
const other = "741fc347-441a-4331-9281-16c841164735";

describe("ChatGPT job import reports", () => {
  it("lets the owner read report history and hides it from other accounts", async () => {
    const db = new PGlite();
    try {
      await db.exec(`
        create role anon;
        create role authenticated;
        create role service_role bypassrls;
        create schema auth;
        create table auth.users (id uuid primary key);
        create function auth.uid() returns uuid language sql stable as $$
          select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
        $$;
        grant usage on schema auth to authenticated, service_role, anon;
      `);
      for (const migration of [
        "20261112174836_job_hunter",
        "20261121033000_chatgpt_job_import_reports",
      ]) {
        await db.exec(readFileSync(`supabase/migrations/${migration}.sql`, "utf8"));
      }
      await db.query("insert into auth.users values ($1), ($2)", [owner, other]);
      await db.exec("set role service_role");
      await db.query(
        `insert into public.job_import_reports
          (user_id, source, automation_title, summary, generated_at, job_count, new_count, duplicate_count)
         values ($1, 'chatgpt_research', 'Job research', 'No new roles.', '2026-11-21T00:00:00Z', 0, 0, 0)`,
        [owner],
      );

      await db.exec("set role authenticated");
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [other]);
      expect((await db.query("select user_id from public.job_import_reports")).rows).toEqual([]);
      await expect(
        db.query(
          `insert into public.job_import_reports
            (user_id, source, automation_title, summary, job_count, new_count, duplicate_count)
           values ($1, 'chatgpt_research', 'Forged', 'No.', 0, 0, 0)`,
          [other],
        ),
      ).rejects.toThrow();

      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [owner]);
      expect(
        (await db.query("select automation_title from public.job_import_reports")).rows,
      ).toEqual([{ automation_title: "Job research" }]);

      await db.exec("set role anon");
      await expect(db.query("select id from public.job_import_reports")).rejects.toThrow();
    } finally {
      await db.close();
    }
  });
});
