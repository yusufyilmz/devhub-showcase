import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

describe("CvVariantRls", () => {
  it("keeps CV content private to its account and prevents ownership changes", async () => {
    const db = new PGlite();
    const a = "11111111-1111-4111-8111-111111111111";
    const b = "22222222-2222-4222-8222-222222222222";
    try {
      await db.exec(`create schema auth; create role anon; create role authenticated; grant usage on schema public,auth to anon,authenticated;
        create table auth.users(id uuid primary key);
        create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;`);
      await db.query("insert into auth.users(id) values ($1),($2)", [a, b]);
      const migration = readdirSync("supabase/migrations").find((name) =>
        name.endsWith("_private_cv_variants.sql"),
      );
      if (!migration) throw new Error("Missing migration");
      await db.exec(readFileSync(`supabase/migrations/${migration}`, "utf8"));
      await db.exec(
        `set role authenticated; select set_config('request.jwt.claim.sub','${a}',false)`,
      );
      await db.query("insert into public.portfolio_cv_variants(owner_id,variants) values ($1,$2)", [
        a,
        [{ content: "Draft story", name: "Private library" }],
      ]);
      await db.exec(`select set_config('request.jwt.claim.sub','${b}',false)`);
      expect((await db.query("select variants from public.portfolio_cv_variants")).rows).toEqual(
        [],
      );
      await expect(
        db.query("insert into public.portfolio_cv_variants(owner_id,variants) values ($1,$2)", [
          a,
          [],
        ]),
      ).rejects.toThrow();
      await db.exec(`select set_config('request.jwt.claim.sub','${a}',false)`);
      await expect(
        db.query("update public.portfolio_cv_variants set owner_id=$1", [b]),
      ).rejects.toThrow();
      await db.query("update public.portfolio_cv_variants set variants=$1 where owner_id=$2", [
        [{ name: "Updated" }],
        a,
      ]);
      await db.exec("reset role; set role anon");
      await expect(db.query("select variants from public.portfolio_cv_variants")).rejects.toThrow();
    } finally {
      await db.close();
    }
  }, 20_000);
});
