import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

describe("Studio account preferences", () => {
  it("isolates preference reads and writes by account", async () => {
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
        readFileSync("supabase/migrations/20261113090000_studio_account_preferences.sql", "utf8"),
      );
      await db.exec(`
        set role authenticated;
        set request.jwt.claim.sub = '${owner}';
        insert into public.studio_account_preferences values ('${owner}', 'mode', '"dark"');
        insert into public.studio_account_preferences values ('${owner}', 'mode', null)
          on conflict (user_id, key) do update set value = excluded.value;
      `);
      expect(
        (await db.query("select key,value from public.studio_account_preferences")).rows,
      ).toEqual([{ key: "mode", value: null }]);
      await db.exec(`set request.jwt.claim.sub = '${other}'`);
      expect((await db.query("select key from public.studio_account_preferences")).rows).toEqual(
        [],
      );
      await expect(
        db.query("insert into public.studio_account_preferences values ($1, 'mode', 'null')", [
          owner,
        ]),
      ).rejects.toThrow(/row-level security/i);
      await db.exec("set role anon");
      await expect(db.query("select * from public.studio_account_preferences")).rejects.toThrow(
        /permission denied/i,
      );
    } finally {
      await db.close();
    }
  });
});
