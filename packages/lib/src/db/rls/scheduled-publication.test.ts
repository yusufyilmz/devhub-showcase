import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

import { profile } from "@shared/config";

const owner = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
async function database() {
  const db = new PGlite();
  await db.exec(`create schema auth; create schema private; create role anon; create role authenticated; create role service_role;
    grant usage on schema public,auth,private to authenticated,anon,service_role;
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create table private.portfolio_admins(user_id uuid primary key);
    create function private.is_portfolio_admin() returns boolean language sql stable as $$select exists(select 1 from private.portfolio_admins where user_id=auth.uid())$$;
    create table public.portfolio_profiles(id text primary key,username text unique not null,document jsonb not null,revision integer not null,is_public boolean not null,owner_id uuid,managed_by uuid,updated_at timestamptz default now());
    create policy "Read published CV" on public.portfolio_profiles for select using(is_public);`);
  for (const file of [
    "20261103130000_publication_snapshots",
    "20261103150000_unlisted_publications",
    "20261104090000_scheduled_publication",
  ])
    await db.exec(readFileSync(`supabase/migrations/${file}.sql`, "utf8"));
  await db.query(
    "insert into public.portfolio_profiles(id,username,document,revision,is_public,owner_id) values('test','test-owner',$1,1,false,$2)",
    [profile, owner],
  );
  return db;
}
async function signIn(db: PGlite, id = owner) {
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub','${id}',false); set role authenticated`,
  );
}
async function schedule(db: PGlite) {
  return (
    await db.query<{ id: string }>(
      "select public.schedule_portfolio_publication('test',1,now()+interval '1 hour','Europe/Madrid') as id",
    )
  ).rows[0]!.id;
}
async function execute(db: PGlite) {
  await db.exec(
    "reset role; update private.portfolio_schedules set run_at=now()-interval '1 minute' where state='pending';set role service_role",
  );
  return (await db.query<{ count: number }>("select public.execute_portfolio_schedules() as count"))
    .rows[0]!.count;
}
describe("reviewed scheduled publication", () => {
  it("freezes both reviewed outputs despite later edits and executes only once", async () => {
    const db = await database();
    try {
      await signIn(db);
      await schedule(db);
      await db.exec("set role service_role");
      expect(
        (await db.query<{ count: number }>("select public.execute_portfolio_schedules() as count"))
          .rows[0]!.count,
      ).toBe(0);
      await signIn(db);
      expect(
        (await db.query("select public.portfolio_schedule_status('test') as status")).rows[0],
      ).not.toHaveProperty("website");
      await expect(db.query("select * from private.portfolio_schedules")).rejects.toThrow();
      await expect(db.query("select public.execute_portfolio_schedules()")).rejects.toThrow();
      await db.exec(
        "reset role; update public.portfolio_profiles set document=jsonb_set(document,'{title}','\"Later private draft\"'),revision=2 where id='test'",
      );
      expect(await execute(db)).toBe(1);
      expect(await execute(db)).toBe(0);
      await db.exec("reset role");
      const rows = (
        await db.query<{ document: typeof profile; revision: number }>(
          "select document,revision from public.portfolio_publications union all select document,revision from public.portfolio_public_cvs",
        )
      ).rows;
      expect(rows).toHaveLength(2);
      expect(rows.every((row) => row.revision === 1 && row.document.title === profile.title)).toBe(
        true,
      );
    } finally {
      await db.close();
    }
  });
  it("rejects stale, invalid and unauthorized scheduling; replacements and cancellation cannot execute", async () => {
    const db = await database();
    try {
      await signIn(db, other);
      await expect(schedule(db)).rejects.toThrow("denied");
      await signIn(db);
      await expect(
        db.query(
          "select public.schedule_portfolio_publication('test',2,now()+interval '1 hour','UTC')",
        ),
      ).rejects.toThrow("Revision");
      await expect(
        db.query(
          "select public.schedule_portfolio_publication('test',1,now()-interval '1 hour','UTC')",
        ),
      ).rejects.toThrow("Invalid");
      await expect(
        db.query(
          "select public.schedule_portfolio_publication('test',1,now()+interval '1 hour','invalid')",
        ),
      ).rejects.toThrow("Invalid");
      const first = await schedule(db);
      const second = await schedule(db);
      expect(first).not.toBe(second);
      expect(
        (
          await db.query<{ cancelled: boolean }>(
            "select public.cancel_portfolio_schedule('test',$1) as cancelled",
            [first],
          )
        ).rows[0]!.cancelled,
      ).toBe(false);
      await db.query("select public.cancel_portfolio_schedule('test',$1)", [second]);
      expect(await execute(db)).toBe(0);
    } finally {
      await db.close();
    }
  });
  it("cancels on immediate publication/withdrawal and transfer, and rolls back a failed publish", async () => {
    const db = await database();
    try {
      await signIn(db);
      await schedule(db);
      await db.query("select public.set_portfolio_publication('test',1,false)");
      expect(await execute(db)).toBe(0);
      await signIn(db);
      await schedule(db);
      await db.exec(
        `reset role;update public.portfolio_profiles set owner_id='${other}' where id='test'`,
      );
      expect(await execute(db)).toBe(0);
      await signIn(db, other);
      await schedule(db);
      await db.exec(
        "reset role; create function private.fail_cv() returns trigger language plpgsql as $$begin raise exception 'fixture failure';end$$;create trigger fail_cv before insert on public.portfolio_public_cvs for each row execute function private.fail_cv()",
      );
      expect(await execute(db)).toBe(0);
      await db.exec("reset role");
      expect((await db.query("select * from public.portfolio_publications")).rows).toHaveLength(0);
      const failed = (
        await db.query<{ state: string; error: string }>(
          "select state,error from private.portfolio_schedules where state='failed'",
        )
      ).rows;
      expect(failed).toHaveLength(1);
      expect(failed[0]!.error).not.toContain("fixture");
    } finally {
      await db.close();
    }
  });
  it("rejects revoked manager access at execution and hides schedule metadata from other users", async () => {
    const db = await database();
    try {
      await db.exec(
        `insert into private.portfolio_admins values('${owner}');update public.portfolio_profiles set owner_id=null,managed_by='${owner}' where id='test'`,
      );
      await signIn(db);
      await schedule(db);
      await signIn(db, other);
      await expect(db.query("select public.portfolio_schedule_status('test')")).rejects.toThrow(
        "denied",
      );
      await db.exec(`reset role;delete from private.portfolio_admins where user_id='${owner}'`);
      expect(await execute(db)).toBe(0);
      await db.exec("reset role");
      expect(
        (await db.query<{ state: string }>("select state from private.portfolio_schedules"))
          .rows[0]!.state,
      ).toBe("failed");
      expect((await db.query("select * from public.portfolio_publications")).rows).toHaveLength(0);
    } finally {
      await db.close();
    }
  });
});
