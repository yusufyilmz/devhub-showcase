import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

import { type PortfolioProfile, profile, projectPublicProfile } from "@shared/config";

describe("explicit publication snapshots", () => {
  it("keeps draft writes private, publishes both outputs atomically, and rejects stale or unauthorized changes", async () => {
    const db = new PGlite();
    const a = "11111111-1111-4111-8111-111111111111";
    const b = "22222222-2222-4222-8222-222222222222";
    const source: PortfolioProfile = {
      ...profile,
      birthDate: "1990-01-01",
      customSections: [
        {
          id: "custom-hidden",
          items: [],
          renderer: "cards" as const,
          title: "Private notes",
          visible: false,
        },
        {
          id: "custom-source",
          items: [{ body: "Secret", id: "draft", title: "Dormant secret", url: "" }],
          options: { email: profile.email },
          renderer: "cards" as const,
          source: {
            field: "projects" as const,
            itemIds: profile.projects.map((item) => item.id),
            type: "profile" as const,
          },
          title: "Selected work",
          visible: true,
        },
        {
          id: "custom-map",
          items: [],
          renderer: "cards" as const,
          sectionType: "map" as const,
          title: "Location",
          visible: true,
        },
      ],
      cvFields: { phone: false },
      projects: profile.projects.map((item, index) => ({ ...item, public: index !== 0 })),
      sectionSequence: ["about", "custom-hidden", "custom-source", "custom-map"],
      sectionSettings: { experience: { visible: false } },
      websiteFields: { email: false, location: false },
    };
    try {
      await db.exec(
        `create schema auth;create schema private;create role anon;create role authenticated;grant usage on schema public,auth,private to authenticated,anon;create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create function private.is_portfolio_admin() returns boolean language sql stable as $$select current_setting('request.jwt.claim.admin',true)='true'$$;create table public.portfolio_profiles(id text primary key,username text unique not null,document jsonb not null,revision integer not null,is_public boolean not null,owner_id uuid,managed_by uuid,updated_at timestamptz default now());alter table public.portfolio_profiles enable row level security;grant select on public.portfolio_profiles to authenticated,anon;grant update(document,revision,updated_at,is_public) on public.portfolio_profiles to authenticated;create policy "Read published CV" on public.portfolio_profiles for select to anon,authenticated using(is_public);create policy own_read on public.portfolio_profiles for select to authenticated using(owner_id=auth.uid());create policy own_update on public.portfolio_profiles for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());`,
      );
      await db.query(
        "insert into public.portfolio_profiles(id,username,document,revision,is_public,owner_id) values ($1,$2,$3,1,true,$4)",
        ["test", "test-owner", source, a],
      );
      await db.exec(
        readFileSync("supabase/migrations/20261103130000_publication_snapshots.sql", "utf8"),
      );
      await db.query(
        "insert into public.portfolio_profiles(id,username,document,revision,is_public,managed_by) values ('managed','managed-owner',$1,1,false,$2)",
        [source, a],
      );
      const web = (
        await db.query<{ document: unknown }>(
          "select document from public.portfolio_publications where id='test'",
        )
      ).rows[0]!.document;
      expect(web).toEqual(JSON.parse(JSON.stringify(projectPublicProfile(source, "website"))));
      const cv = (
        await db.query<{ document: unknown }>(
          "select document from public.portfolio_public_cvs where id='test'",
        )
      ).rows[0]!.document;
      expect(cv).toEqual(JSON.parse(JSON.stringify(projectPublicProfile(source, "cv"))));
      await db.exec(
        `set role authenticated;select set_config('request.jwt.claim.sub','${a}',false)`,
      );
      await db.query("update public.portfolio_profiles set document=$1,revision=2 where id=$2", [
        { ...source, title: "Saved private draft" },
        "test",
      ]);
      expect(
        (
          await db.query<{ document: { title: string } }>(
            "select document from public.portfolio_publications",
          )
        ).rows[0]!.document.title,
      ).toBe(source.title);
      await expect(
        db.query("select public.set_portfolio_publication($1,1,true)", ["test"]),
      ).rejects.toThrow(/conflict/);
      await expect(
        db.query("select public.set_portfolio_publication($1,null,true)", ["test"]),
      ).rejects.toThrow(/conflict/);
      await db.query("select public.set_portfolio_publication($1,2,true)", ["test"]);
      expect(
        (
          await db.query<{ document: { title: string } }>(
            "select document from public.portfolio_publications",
          )
        ).rows[0]!.document.title,
      ).toBe("Saved private draft");
      await db.exec(`select set_config('request.jwt.claim.sub','${b}',false)`);
      await expect(
        db.query("select public.set_portfolio_publication($1,2,false)", ["test"]),
      ).rejects.toThrow();
      expect((await db.query("select * from public.portfolio_profiles")).rows).toEqual([]);
      await db.exec(`select set_config('request.jwt.claim.sub','${a}',false)`);
      await expect(
        db.query("update public.portfolio_profiles set is_public=false"),
      ).rejects.toThrow();
      await db.query("select public.set_portfolio_publication($1,2,false)", ["test"]);
      expect(
        (await db.query("select * from public.portfolio_publications where id='test'")).rows,
      ).toEqual([]);
      expect(
        (await db.query("select * from public.portfolio_public_cvs where id='test'")).rows,
      ).toEqual([]);
      // An unowned row must not authorize an unrelated signed-in user through SQL NULL.
      await db.exec(
        `select set_config('request.jwt.claim.sub','${b}',false);select set_config('request.jwt.claim.admin','true',false)`,
      );
      await expect(
        db.query("select public.set_portfolio_publication('managed',1,true)"),
      ).rejects.toThrow(/denied/);
      await db.exec(
        `select set_config('request.jwt.claim.sub','${a}',false);select set_config('request.jwt.claim.admin','false',false)`,
      );
      await expect(
        db.query("select public.set_portfolio_publication('managed',1,true)"),
      ).rejects.toThrow(/denied/);
      await db.exec("select set_config('request.jwt.claim.admin','true',false)");
      await db.query("select public.set_portfolio_publication('managed',1,true)");
      await db.exec("select set_config('request.jwt.claim.admin','false',false)");
      await expect(
        db.query("select public.set_portfolio_publication('managed',1,false)"),
      ).rejects.toThrow(/denied/);
      await expect(db.query("delete from public.portfolio_publications")).rejects.toThrow();
      await expect(
        db.query("update public.portfolio_public_cvs set revision=99"),
      ).rejects.toThrow();
      await db.exec("reset role;set role anon");
      await expect(
        db.query("select public.set_portfolio_publication('managed',1,false)"),
      ).rejects.toThrow();
      await expect(db.query("select * from public.portfolio_profiles")).rejects.toThrow();
    } finally {
      await db.close();
    }
  }, 20000);
});
