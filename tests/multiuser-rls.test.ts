import { readdirSync, readFileSync } from "node:fs";

import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("isolates two private CVs, allows opt-in publishing, and protects ownership and main", async () => {
  const db = new PGlite();
  const root = "00000000-0000-4000-8000-000000000000";
  const a = "11111111-1111-4111-8111-111111111111";
  const b = "22222222-2222-4222-8222-222222222222";
  try {
    await db.exec(`create schema auth; create role anon; create role authenticated; grant usage on schema public,auth to anon,authenticated;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;`);
    for (const id of [root, a, b]) await db.query("insert into auth.users(id) values ($1)", [id]);
    const migrations = readdirSync("supabase/migrations");
    const apply = async (suffix: string) => {
      const name = migrations.find((name) => name.endsWith(suffix));
      if (!name) throw new Error(`Missing ${suffix}`);
      await db.exec(readFileSync(`supabase/migrations/${name}`, "utf8"));
    };
    await apply("_portfolio_admin.sql");
    await db.query("update public.portfolio_profiles set owner_id=$1 where id='main'", [root]);
    await apply("_user_cv_profiles.sql");
    await apply("_cv_usernames.sql");
    const identity = async (id: string) =>
      db.exec(
        `reset role; set role authenticated; select set_config('request.jwt.claim.sub','${id}',false)`,
      );
    await identity(a);
    await db.query(
      "insert into public.portfolio_profiles(id,owner_id,document) values ($1,$2,$3)",
      [a, a, { name: "Alice" }],
    );
    await expect(
      db.query("insert into public.portfolio_profiles(id,owner_id,document) values ($1,$2,$3)", [
        b,
        b,
        { name: "Bob" },
      ]),
    ).rejects.toThrow();
    await expect(
      db.query("insert into public.portfolio_profiles(id,owner_id,document) values ($1,$2,$3)", [
        b,
        a,
        { name: "Duplicate" },
      ]),
    ).rejects.toThrow();
    await identity(b);
    await db.query(
      "insert into public.portfolio_profiles(id,owner_id,document) values ($1,$2,$3)",
      [b, b, { name: "Bob" }],
    );
    await db.query("update public.portfolio_profiles set username=$1 where id=$2", ["bob", b]);
    for (const username of ["admin", "alice/edit", "Alice", "bad--name"]) {
      await expect(
        db.query("update public.portfolio_profiles set username=$1 where id=$2", [username, b]),
      ).rejects.toThrow();
    }
    expect(
      (
        await db.query(
          "update public.portfolio_profiles set username=$1 where id=$2 returning id",
          ["stolen", a],
        )
      ).rows,
    ).toEqual([]);
    await identity(a);
    await expect(
      db.query("update public.portfolio_profiles set username=$1 where id=$2", ["bob", a]),
    ).rejects.toThrow();
    await db.query("update public.portfolio_profiles set username=$1 where id=$2", ["alice", a]);
    await identity(b);
    expect(
      (await db.query("select document from public.portfolio_profiles where id=$1", [a])).rows,
    ).toEqual([]);
    expect(
      (
        await db.query(
          "update public.portfolio_profiles set document=$1 where id=$2 returning id",
          [{ name: "Hijacked" }, a],
        )
      ).rows,
    ).toEqual([]);
    await expect(
      db.query("update public.portfolio_profiles set owner_id=$1 where id=$2", [a, b]),
    ).rejects.toThrow();
    await expect(
      db.query("update public.portfolio_profiles set id=$1 where id=$2", ["main", b]),
    ).rejects.toThrow();
    await expect(
      db.query("delete from public.portfolio_profiles where id=$1", [b]),
    ).rejects.toThrow();
    await db.exec("reset role; set role anon");
    expect((await db.query("select id from public.portfolio_profiles")).rows).toEqual([
      { id: "main" },
    ]);
    await identity(a);
    await db.query(
      "update public.portfolio_profiles set is_public=true, revision=2 where id=$1 and revision=1",
      [a],
    );
    await db.exec("reset role; set role anon");
    expect(
      (await db.query("select document from public.portfolio_profiles where id=$1", [a])).rows,
    ).toEqual([{ document: { name: "Alice" } }]);
    expect(
      (await db.query("select document from public.portfolio_profiles where id=$1", [b])).rows,
    ).toEqual([]);
    await identity(a);
    await db.query("update public.portfolio_profiles set is_public=false where id=$1", [a]);
    await db.exec("reset role; set role anon");
    expect(
      (await db.query("select id from public.portfolio_profiles where id=$1", [a])).rows,
    ).toEqual([]);
  } finally {
    await db.close();
  }
}, 15000);
