import { readdirSync, readFileSync } from "node:fs";

import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

import { createEmptyProfile } from "../packages/lib/src/services/user-profile";

const admin = "00000000-0000-4000-8000-000000000000";
const alice = "11111111-1111-4111-8111-111111111111";
const bob = "22222222-2222-4222-8222-222222222222";
const imported = "33333333-3333-4333-8333-333333333333";
it("restricts management and transfers to admins while protecting private and edited user work", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create schema auth; create role anon; create role authenticated; grant usage on schema public,auth to anon,authenticated;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;`);
    for (const [id, email] of [
      [admin, "admin@example.com"],
      [alice, "alice@example.com"],
      [bob, "bob@example.com"],
    ])
      await db.query("insert into auth.users values ($1,$2,now())", [id, email]);
    const apply = async (suffix: string) => {
      const name = readdirSync("supabase/migrations").find((name) => name.endsWith(suffix));
      if (!name) throw new Error(suffix);
      await db.exec(readFileSync(`supabase/migrations/${name}`, "utf8"));
    };
    await apply("_portfolio_admin.sql");
    await db.query("update public.portfolio_profiles set owner_id=$1 where id='main'", [admin]);
    await apply("_user_cv_profiles.sql");
    await apply("_cv_usernames.sql");
    await apply("_managed_portfolios.sql");
    await apply("_managed_membership_policy.sql");
    await apply("_protect_main_management.sql");
    await expect(
      db.query("update public.portfolio_profiles set owner_id=null,managed_by=$1 where id='main'", [
        admin,
      ]),
    ).rejects.toThrow();
    const identity = (id: string) =>
      db.exec(
        `reset role; set role authenticated; select set_config('request.jwt.claim.sub','${id}',false)`,
      );
    await identity(alice);
    await expect(
      db.query("insert into public.portfolio_profiles(id,managed_by,document) values ($1,$2,$3)", [
        imported,
        alice,
        {},
      ]),
    ).rejects.toThrow();
    await expect(db.query("select * from private.portfolio_admins")).rejects.toThrow();
    await db.query(
      "insert into public.portfolio_profiles(id,owner_id,document) values ($1,$2,$3)",
      [alice, alice, { name: "Private Alice" }],
    );
    await identity(admin);
    expect((await db.query("select public.is_portfolio_admin() as allowed")).rows).toEqual([
      { allowed: true },
    ]);
    expect(
      (await db.query("select id from public.portfolio_profiles where id=$1", [alice])).rows,
    ).toEqual([]);
    await db.query(
      "insert into public.portfolio_profiles(id,username,managed_by,document) values ($1,$2,$3,$4)",
      [imported, "managed-import", admin, createEmptyProfile({ email: "draft@example.com" })],
    );
    await expect(
      db.query("select public.transfer_managed_portfolio($1,$2,1)", [
        imported,
        "missing@example.com",
      ]),
    ).rejects.toThrow(/sign in with Google/);
    await expect(
      db.query("select public.transfer_managed_portfolio($1,$2,1)", [
        imported,
        "alice@example.com",
      ]),
    ).rejects.toThrow(/edited work/);
    await expect(
      db.query("select public.transfer_managed_portfolio($1,$2,2)", [imported, "bob@example.com"]),
    ).rejects.toThrow(/Reload/);
    await identity(bob);
    const starter = createEmptyProfile({ email: "bob@example.com" });
    await db.query(
      "insert into public.portfolio_profiles(id,owner_id,document) values ($1,$2,$3)",
      [bob, bob, starter],
    );
    expect(
      (await db.query("select id from public.portfolio_profiles where id=$1", [imported])).rows,
    ).toEqual([]);
    await expect(
      db.query("select public.transfer_managed_portfolio($1,$2,1)", [imported, "bob@example.com"]),
    ).rejects.toThrow(/Admin access/);
    await expect(
      db.query("update public.portfolio_profiles set managed_by=$1 where id=$2", [bob, imported]),
    ).rejects.toThrow();
    await identity(admin);
    await db.query("update public.portfolio_profiles set is_public=true,revision=2 where id=$1", [
      imported,
    ]);
    await db.exec("reset role; set role anon");
    expect(
      (await db.query("select id from public.portfolio_profiles where id=$1", [imported])).rows,
    ).toHaveLength(1);
    await expect(
      db.query("select public.transfer_managed_portfolio($1,$2,2)", [imported, "bob@example.com"]),
    ).rejects.toThrow();
    await identity(admin);
    await db.query("update public.portfolio_profiles set is_public=false where id=$1", [imported]);
    await db.query("select public.transfer_managed_portfolio($1,$2,2)", [
      imported,
      "bob@example.com",
    ]);
    expect(
      (await db.query("select document from public.portfolio_profiles where id=$1", [bob])).rows,
    ).toEqual([{ document: starter }]);
    expect(
      (await db.query("select id from public.portfolio_profiles where id=$1", [imported])).rows,
    ).toEqual([]);
    await identity(bob);
    expect(
      (
        await db.query("select owner_id,managed_by from public.portfolio_profiles where id=$1", [
          imported,
        ])
      ).rows,
    ).toEqual([{ managed_by: null, owner_id: bob }]);
    expect(
      (await db.query("select id from public.portfolio_profiles where id=$1", [bob])).rows,
    ).toEqual([]);
  } finally {
    await db.close();
  }
}, 20000);
