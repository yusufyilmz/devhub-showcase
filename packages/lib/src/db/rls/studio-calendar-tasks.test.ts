import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

describe("Studio calendar tasks", () => {
  it("allows only the owner to read or change a task", async () => {
    const db = new PGlite();
    const owner = "11111111-1111-4111-8111-111111111111";
    const other = "22222222-2222-4222-8222-222222222222";
    try {
      await db.exec(`
        create role anon;
        create role authenticated;
        create schema auth;
        create table auth.users (id uuid primary key);
        insert into auth.users values ('${owner}'), ('${other}');
        create function auth.uid() returns uuid language sql stable as $$
          select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
        $$;
        create function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
        grant usage on schema auth to authenticated;
      `);
      await db.exec(
        readFileSync("supabase/migrations/20261117090000_studio_calendar_tasks.sql", "utf8"),
      );
      await db.exec(`
        set role authenticated;
        set request.jwt.claim.sub = '${owner}';
        insert into public.studio_calendar_tasks (user_id, title, day)
          values ('${owner}', 'Review roadmap', '2026-11-17');
      `);
      expect((await db.query("select title from public.studio_calendar_tasks")).rows).toEqual([
        { title: "Review roadmap" },
      ]);
      await db.exec(`set request.jwt.claim.sub = '${other}'`);
      expect((await db.query("select title from public.studio_calendar_tasks")).rows).toEqual([]);
      expect(
        (await db.query("delete from public.studio_calendar_tasks returning id")).rows,
      ).toEqual([]);
      await expect(
        db.query(
          "insert into public.studio_calendar_tasks (user_id, title, day) values ($1, 'Other task', '2026-11-17')",
          [owner],
        ),
      ).rejects.toThrow(/row-level security/i);
      await db.exec("set role anon");
      await expect(db.query("select * from public.studio_calendar_tasks")).rejects.toThrow(
        /permission denied/i,
      );
    } finally {
      await db.close();
    }
  });
});
