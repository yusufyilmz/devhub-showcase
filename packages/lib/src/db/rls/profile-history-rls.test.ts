import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

describe("private saved profile history", () => {
  it("captures revisions, bounds retention, and authorizes current owner or manager only", async () => {
    const db = new PGlite();
    const a = "11111111-1111-4111-8111-111111111111";
    const b = "22222222-2222-4222-8222-222222222222";
    try {
      await db.exec(
        `create schema auth;create schema private;create role anon;create role authenticated;grant usage on schema public,auth,private to anon,authenticated;create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create function private.is_portfolio_admin() returns boolean language sql stable as $$select current_setting('request.jwt.claim.admin',true)='true'$$;create table public.portfolio_profiles(id text primary key,owner_id uuid,managed_by uuid,revision integer,document jsonb);grant select on public.portfolio_profiles to authenticated;`,
      );
      await db.exec(
        readFileSync("supabase/migrations/20261103120000_private_profile_history.sql", "utf8"),
      );
      await db.query("insert into public.portfolio_profiles values ($1,$2,null,0,$3)", [
        "profile",
        a,
        { summary: "Private source" },
      ]);
      for (let n = 1; n <= 22; n++)
        await db.query("update public.portfolio_profiles set revision=$1,document=$2 where id=$3", [
          n,
          { summary: `Revision ${n}` },
          "profile",
        ]);
      expect((await db.query("select * from public.portfolio_profile_history")).rows).toHaveLength(
        20,
      );
      await db.exec(
        `set role authenticated;select set_config('request.jwt.claim.sub','${b}',false)`,
      );
      expect((await db.query("select * from public.portfolio_profile_history")).rows).toEqual([]);
      await db.exec(`select set_config('request.jwt.claim.sub','${a}',false)`);
      expect((await db.query("select * from public.portfolio_profile_history")).rows).toHaveLength(
        20,
      );
      await expect(db.query("delete from public.portfolio_profile_history")).rejects.toThrow();
      await db.exec("reset role");
      await db.query(
        "update public.portfolio_profiles set owner_id=null, managed_by=$1 where id=$2",
        [b, "profile"],
      );
      await db.exec(
        `set role authenticated;select set_config('request.jwt.claim.sub','${b}',false);select set_config('request.jwt.claim.admin','true',false)`,
      );
      expect((await db.query("select * from public.portfolio_profile_history")).rows).toHaveLength(
        20,
      );
      await db.exec("select set_config('request.jwt.claim.admin','false',false)");
      expect((await db.query("select * from public.portfolio_profile_history")).rows).toEqual([]);
      await db.exec("reset role");
      await db.exec(
        "update public.portfolio_profile_history set created_at=now()-interval '91 days'",
      );
      await db.exec(
        "set role authenticated;select set_config('request.jwt.claim.admin','true',false)",
      );
      expect((await db.query("select * from public.portfolio_profile_history")).rows).toEqual([]);
      await db.exec("reset role;set role anon");
      await expect(db.query("select * from public.portfolio_profile_history")).rejects.toThrow();
    } finally {
      await db.close();
    }
  }, 20000);
});
