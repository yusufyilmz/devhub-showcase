import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

import { profile } from "@shared/config";

const owner = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
const digest = `scrypt-v1$${"a".repeat(32)}$${"b".repeat(64)}`;
async function database(installPassword = true) {
  const db = new PGlite();
  await db.exec(`create schema auth;create schema private;create role anon;create role authenticated;create role service_role;
 grant usage on schema public,auth,private to anon,authenticated,service_role;
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table private.portfolio_admins(user_id uuid primary key);
 create function private.is_portfolio_admin() returns boolean language sql stable as $$select exists(select 1 from private.portfolio_admins where user_id=auth.uid())$$;
 create table public.portfolio_profiles(id text primary key,username text unique not null,document jsonb not null,revision integer not null,is_public boolean not null,owner_id uuid,managed_by uuid,updated_at timestamptz default now());
 create policy "Read published CV" on public.portfolio_profiles for select using(is_public);`);
  for (const name of [
    "20261103130000_publication_snapshots",
    "20261103140000_retained_username_aliases",
    "20261103150000_unlisted_publications",
    "20261104090000_scheduled_publication",
    "20261104094250_password_protected_publications",
  ]) {
    if (!installPassword && name.endsWith("password_protected_publications")) continue;
    await db.exec(readFileSync(`supabase/migrations/${name}.sql`, "utf8"));
  }
  await db.query(
    "insert into public.portfolio_profiles(id,username,document,revision,is_public,owner_id) values('test','test-owner',$1,1,false,$2)",
    [{ ...profile, publicationVisibility: "password" }, owner],
  );
  await signIn(db);
  return db;
}
async function signIn(db: PGlite, id = owner) {
  await db.exec(
    `reset role;select set_config('request.jwt.claim.sub','${id}',false);set role authenticated`,
  );
}
async function publish(db: PGlite) {
  await db.query("select public.publish_portfolio_with_password('test',1,$1)", [digest]);
}
async function version(db: PGlite) {
  await db.exec("reset role;set role service_role");
  return (
    await db.query<{ data: { access_version: string; password_digest: string } }>(
      "select public.portfolio_password_record('test') as data",
    )
  ).rows[0]!.data;
}
describe("password-protected publication database boundary", () => {
  it("hides both documents from anonymous and unrelated users while retaining owner review", async () => {
    const db = await database();
    try {
      await expect(
        db.query("select public.set_portfolio_publication('test',1,true)"),
      ).rejects.toThrow("password");
      await publish(db);
      expect(
        (
          await db.query(
            "select document from public.portfolio_publications union all select document from public.portfolio_public_cvs",
          )
        ).rows,
      ).toHaveLength(2);
      await signIn(db, other);
      expect(
        (
          await db.query(
            "select document from public.portfolio_publications union all select document from public.portfolio_public_cvs",
          )
        ).rows,
      ).toHaveLength(0);
      await db.exec("reset role;set role anon");
      expect(
        (
          await db.query(
            "select document from public.portfolio_publications union all select document from public.portfolio_public_cvs",
          )
        ).rows,
      ).toHaveLength(0);
      await expect(db.query("select public.portfolio_password_record('test')")).rejects.toThrow();
      await expect(db.query("select * from private.portfolio_passwords")).rejects.toThrow();
      const gate = (
        await db.query<{ gate: unknown }>(
          "select public.portfolio_access_status('test-owner') as gate",
        )
      ).rows[0]!.gate;
      expect(gate).toEqual({ id: "test", username: "test-owner" });
    } finally {
      await db.close();
    }
  });
  it("checks access versions inside each server-only read and revokes them on republish, withdrawal and transfer", async () => {
    const db = await database();
    try {
      await publish(db);
      const first = await version(db);
      const read = () =>
        db.query<{ data: unknown }>(
          "select public.read_protected_publication('test',$1,'cv') as data",
          [first.access_version],
        );
      expect((await read()).rows[0]!.data).not.toBeNull();
      await signIn(db);
      await db.query("select public.set_portfolio_publication('test',1,true)");
      const second = await version(db);
      expect(first.access_version).not.toBe(second.access_version);
      expect((await read()).rows[0]!.data).toBeNull();
      await signIn(db);
      await db.query("select public.set_portfolio_publication('test',1,false)");
      expect(await version(db)).toBeNull();
      await signIn(db);
      await publish(db);
      await db.exec(
        `reset role;update public.portfolio_profiles set owner_id='${other}' where id='test'`,
      );
      expect(await version(db)).toBeNull();
      await signIn(db, other);
      await expect(
        db.query("select public.set_portfolio_publication('test',1,true)"),
      ).rejects.toThrow("password");
    } finally {
      await db.close();
    }
  });
  it("rejects stale or unauthorized password changes and enforces persistent attempt limits", async () => {
    const db = await database();
    try {
      await signIn(db, other);
      await expect(publish(db)).rejects.toThrow("denied");
      await signIn(db);
      await expect(
        db.query("select public.publish_portfolio_with_password('test',2,$1)", [digest]),
      ).rejects.toThrow("Revision");
      await publish(db);
      await version(db);
      const reserve = () =>
        db.query<{ allowed: boolean }>(
          "select public.reserve_portfolio_access_attempt($1) as allowed",
          ["a".repeat(64)],
        );
      for (let i = 0; i < 5; i++) expect((await reserve()).rows[0]!.allowed).toBe(true);
      expect((await reserve()).rows[0]!.allowed).toBe(false);
      await db.exec(
        "reset role;update private.portfolio_access_attempts set started_at=now()-interval '6 minutes';set role service_role",
      );
      expect((await reserve()).rows[0]!.allowed).toBe(true);
      await signIn(db);
      await expect(
        db.query("select public.reserve_portfolio_access_attempt($1)", ["a".repeat(64)]),
      ).rejects.toThrow();
    } finally {
      await db.close();
    }
  });
  it("runs the one-time manual setup with ledger recording and rejects reruns", async () => {
    const db = await database(false);
    try {
      await db.exec(
        "reset role; create schema supabase_migrations; create table supabase_migrations.schema_migrations(version text primary key,name text,statements text[]);",
      );
      const setup = readFileSync("supabase/rollout/password-setup.sql", "utf8");
      await db.exec(setup);
      expect(
        (
          await db.query(
            "select version from supabase_migrations.schema_migrations where name='password_protected_publications'",
          )
        ).rows,
      ).toEqual([{ version: "20261104094250" }]);
      await expect(db.exec(setup)).rejects.toThrow("Password setup already exists");
      await db.exec("rollback");
    } finally {
      await db.close();
    }
  });
});
