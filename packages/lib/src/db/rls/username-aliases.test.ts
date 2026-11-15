import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

import { profile } from "@shared/config";

describe("retained published username aliases", () => {
  it("resolves repeated renames directly, reserves old names, hides withdrawn destinations and permits account cleanup", async () => {
    const db = new PGlite();
    const a = "11111111-1111-4111-8111-111111111111";
    const b = "22222222-2222-4222-8222-222222222222";
    try {
      await db.exec(
        `create schema auth;create schema private;create role anon;create role authenticated;grant usage on schema public,auth,private to authenticated,anon;create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create function private.is_portfolio_admin() returns boolean language sql stable as $$select current_setting('request.jwt.claim.admin',true)='true'$$;create table public.portfolio_profiles(id text primary key,username text unique not null,document jsonb not null,revision integer not null,is_public boolean not null,owner_id uuid,managed_by uuid,updated_at timestamptz default now());alter table public.portfolio_profiles enable row level security;grant select on public.portfolio_profiles to authenticated,anon;grant update(document,revision,updated_at,is_public,username) on public.portfolio_profiles to authenticated;create policy "Read published CV" on public.portfolio_profiles for select to anon,authenticated using(is_public);create policy own_read on public.portfolio_profiles for select to authenticated using(owner_id=auth.uid());create policy own_update on public.portfolio_profiles for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());`,
      );
      await db.query(
        "insert into public.portfolio_profiles(id,username,document,revision,is_public,owner_id) values ('first','first-owner',$1,1,true,$2),('second','second-owner',$1,1,false,$3)",
        [profile, a, b],
      );
      await db.exec(
        readFileSync("supabase/migrations/20261103130000_publication_snapshots.sql", "utf8"),
      );
      await db.exec(
        readFileSync("supabase/migrations/20261103140000_retained_username_aliases.sql", "utf8"),
      );
      await db.exec(
        readFileSync("supabase/migrations/20261103150000_unlisted_publications.sql", "utf8"),
      );
      await db.exec(
        `set role authenticated;select set_config('request.jwt.claim.sub','${a}',false)`,
      );
      await db.query(
        "update public.portfolio_profiles set username='next-owner',revision=2 where id='first'",
      );
      await db.query("select public.set_portfolio_publication('first',2,true)");
      await db.query(
        "update public.portfolio_profiles set username='latest-owner',document=jsonb_set(document,'{publicationVisibility}','\"unlisted\"'::jsonb),revision=3 where id='first'",
      );
      expect(
        (await db.query("select visibility from public.portfolio_publications where id='first'"))
          .rows,
      ).toEqual([{ visibility: "public" }]);
      await db.query("select public.set_portfolio_publication('first',3,true)");
      expect(
        (await db.query("select visibility from public.portfolio_publications where id='first'"))
          .rows,
      ).toEqual([{ visibility: "unlisted" }]);
      expect(
        (await db.query("select visibility from public.portfolio_public_cvs where id='first'"))
          .rows,
      ).toEqual([{ visibility: "unlisted" }]);
      await db.exec("reset role;set role anon");
      expect(
        (
          await db.query(
            "select username from public.portfolio_publications where visibility='public'",
          )
        ).rows,
      ).toEqual([]);
      expect(
        (
          await db.query(
            "select username from public.portfolio_publications where username='latest-owner'",
          )
        ).rows,
      ).toEqual([{ username: "latest-owner" }]);
      for (const username of ["first-owner", "next-owner", "latest-owner"]) {
        expect(
          (await db.query("select * from public.resolve_published_username($1)", [username])).rows,
        ).toEqual([{ id: "first", username: "latest-owner" }]);
      }
      await expect(db.query("select * from private.portfolio_username_aliases")).rejects.toThrow();
      await db.exec(
        `reset role;set role authenticated;select set_config('request.jwt.claim.sub','${b}',false)`,
      );
      await expect(
        db.query("update public.portfolio_profiles set username='first-owner' where id='second'"),
      ).rejects.toThrow(/retained alias/);
      await expect(
        db.query("update public.portfolio_profiles set username='latest-owner' where id='second'"),
      ).rejects.toThrow();
      await db.exec(`select set_config('request.jwt.claim.sub','${a}',false)`);
      await db.query("select public.set_portfolio_publication('first',3,false)");
      expect(
        (await db.query("select * from public.resolve_published_username('first-owner')")).rows,
      ).toEqual([]);
      // Even the withdrawn canonical URL stays reserved for this portfolio.
      await db.exec(`select set_config('request.jwt.claim.sub','${b}',false)`);
      await expect(
        db.query("update public.portfolio_profiles set username='latest-owner' where id='second'"),
      ).rejects.toThrow();
      await db.exec(`select set_config('request.jwt.claim.sub','${a}',false)`);
      await db.query(
        "update public.portfolio_profiles set username='first-owner',revision=4 where id='first'",
      );
      await db.query("select public.set_portfolio_publication('first',4,true)");
      expect(
        (await db.query("select * from public.resolve_published_username('latest-owner')")).rows,
      ).toEqual([{ id: "first", username: "first-owner" }]);
      await db.exec("reset role;delete from public.portfolio_profiles where id='first'");
      expect((await db.query("select * from private.portfolio_username_aliases")).rows).toEqual([]);
      expect(
        (await db.query("select * from public.resolve_published_username('first-owner')")).rows,
      ).toEqual([]);
    } finally {
      await db.close();
    }
  }, 20000);
});
