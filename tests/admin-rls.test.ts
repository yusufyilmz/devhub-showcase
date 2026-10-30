import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("applies the real migration and permits only the assigned owner to publish", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create schema auth; create role anon; create role authenticated; grant usage on schema public,auth to anon,authenticated;
  create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  insert into auth.users(id) values ('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');`);
    const migration = readdirSync("supabase/migrations").find((name) =>
      name.endsWith("_portfolio_admin.sql"),
    );
    if (!migration) throw new Error("Missing migration");
    await db.exec(readFileSync(`supabase/migrations/${migration}`, "utf8"));
    await db.exec("set role anon");
    expect(
      (await db.query("select revision from public.portfolio_profiles")).rows,
    ).toEqual([{ revision: 1 }]);
    await expect(
      db.exec("update public.portfolio_profiles set revision=2"),
    ).rejects.toThrow();
    await db.exec("reset role");
    await db.exec(
      "update public.portfolio_profiles set owner_id='11111111-1111-4111-8111-111111111111'; set role authenticated; select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false)",
    );
    await db.exec("update public.portfolio_profiles set revision=2");
    expect(
      (await db.query("select revision from public.portfolio_profiles")).rows,
    ).toEqual([{ revision: 1 }]);
    await expect(
      db.exec(
        "insert into public.portfolio_profiles(id,document) values ('main','{}')",
      ),
    ).rejects.toThrow();
    await db.exec(
      "select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false)",
    );
    await db.exec(
      "update public.portfolio_profiles set revision=2 where revision=1",
    );
    expect(
      (await db.query("select revision from public.portfolio_profiles")).rows,
    ).toEqual([{ revision: 2 }]);
    await expect(
      db.exec(
        "update public.portfolio_profiles set owner_id='22222222-2222-4222-8222-222222222222'",
      ),
    ).rejects.toThrow();
    await expect(
      db.exec("delete from public.portfolio_profiles"),
    ).rejects.toThrow();
  } finally {
    await db.close();
  }
}, 20000);
