import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

const owner = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";

describe("portfolio testimonial moderation", () => {
  it("limits decisions to the original owner and requeues changed referrals atomically", async () => {
    const db = new PGlite();
    try {
      await db.exec(`
        create schema auth; create schema private;
        create role anon; create role authenticated; create role service_role bypassrls;
        grant usage on schema auth to authenticated;
        create function auth.uid() returns uuid language sql stable as
        $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
        create table public.portfolio_profiles (id text primary key, owner_id uuid);
        insert into public.portfolio_profiles values ('main', '${owner}'), ('other', '${other}');
        grant select on public.portfolio_profiles to authenticated;
        create type public."ReviewState" as enum ('APPROVED', 'PENDING', 'REJECTED');
        create table public.referrals (
          id text primary key, session_id text unique not null, name text, relationship text,
          feedback text, recommendation text, contact_info text, updated_at timestamp(3) not null
        );
        create table public.reviews (
          id text primary key, referral_id text unique not null references public.referrals(id),
          state public."ReviewState" not null, updated_at timestamp(3) not null
        );
        grant all on public.referrals, public.reviews to anon, authenticated, service_role;
      `);
      await db.exec(
        readFileSync("supabase/migrations/20261106142930_protect_portfolio_reviews.sql", "utf8"),
      );
      await db.exec("set role service_role");
      await db.exec(
        "insert into referrals (session_id, name, updated_at) values ('session', 'Alex', now())",
      );
      const pending = await db.query<{ id: string; state: string; version: string }>(
        "select id, state, updated_at::text as version from reviews",
      );
      const [review] = pending.rows;
      expect(review?.state).toBe("PENDING");

      await db.exec("reset role; set role anon");
      await expect(db.query("select * from referrals")).rejects.toThrow("permission denied");
      await expect(db.query("select * from reviews")).rejects.toThrow("permission denied");
      await db.exec(`reset role; set request.jwt.claim.sub = '${other}'; set role authenticated`);
      expect((await db.query("select * from referrals")).rows).toEqual([]);
      expect((await db.query("select * from reviews")).rows).toEqual([]);
      expect((await db.query("update reviews set state = 'APPROVED' returning id")).rows).toEqual(
        [],
      );

      await db.exec(`reset role; set request.jwt.claim.sub = '${owner}'; set role authenticated`);
      expect((await db.query("select name from referrals")).rows).toEqual([{ name: "Alex" }]);
      expect((await db.query("update reviews set state = 'APPROVED' returning id")).rows).toEqual([
        { id: review?.id },
      ]);
      expect((await db.query("update reviews set state = 'REJECTED' returning id")).rows).toEqual(
        [],
      );

      await db.exec("reset role; set role service_role");
      await db.exec(`
        insert into referrals (session_id, feedback, updated_at) values ('session', 'New feedback', now())
        on conflict (session_id) do update set feedback = excluded.feedback, updated_at = excluded.updated_at
      `);
      await db.exec("reset role; set role authenticated");
      expect(
        (
          await db.query(
            "update reviews set state = 'REJECTED' where updated_at = $1 returning id",
            [review?.version],
          )
        ).rows,
      ).toEqual([]);
      expect((await db.query("select state from reviews")).rows).toEqual([{ state: "PENDING" }]);
      expect((await db.query("update reviews set state = 'REJECTED' returning id")).rows).toEqual([
        { id: review?.id },
      ]);
    } finally {
      await db.close();
    }
  }, 20000);
});
