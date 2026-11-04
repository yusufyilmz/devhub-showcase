import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

await test("isolated PostgreSQL billing concurrency and receipts", async () => {
  // Always creates a disposable local cluster. Never accepts a database URL,
  // credentials, or an existing cluster and never connects to a configured app DB.
  const environment = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !key.startsWith("PG")),
  );
  const config = spawnSync("pg_config", ["--bindir"], { encoding: "utf8", env: environment });
  if (config.status !== 0)
    throw new Error(
      "Install PostgreSQL server tools (initdb, postgres and psql) before running this check.",
    );
  const binaries = config.stdout.trim();
  const temporary = mkdtempSync("/tmp/mds-billing-pg-");
  const data = join(temporary, "data");
  const socket = join(temporary, "socket");
  mkdirSync(socket, { mode: 0o700 });
  const account = "11111111-1111-4111-8111-111111111111";
  let server;
  let log = "";
  try {
    const initialized = spawnSync(
      join(binaries, "initdb"),
      ["-D", data, "-U", "fixture", "--auth=trust", "--no-locale", "--encoding=UTF8"],
      { encoding: "utf8", env: environment },
    );
    if (initialized.status !== 0)
      throw new Error(`Could not initialize disposable PostgreSQL: ${initialized.stderr}`);
    server = spawn(
      join(binaries, "postgres"),
      [
        "-D",
        data,
        "-k",
        socket,
        "-p",
        "54329",
        "-c",
        "listen_addresses=",
        "-c",
        "max_connections=60",
        "-c",
        "fsync=off",
        "-c",
        "statement_timeout=15000",
        "-c",
        "lock_timeout=10000",
      ],
      { env: environment, stdio: ["ignore", "pipe", "pipe"] },
    );
    server.stdout.on("data", (chunk) => {
      log = (log + chunk.toString()).slice(-6000);
    });
    server.stderr.on("data", (chunk) => {
      log = (log + chunk.toString()).slice(-6000);
    });
    await ready();
    await setup();
    await simultaneousReservations();
    await duplicateAttempts();
    await leaseAndReceipts();
    process.stdout.write(
      "PostgreSQL billing checks passed: concurrent allowances, request replay, failed-attempt charging, ownership/assignment guards, lease fencing, duplicate receipts and atomic rollback.\n",
    );
  } finally {
    if (server && server.exitCode === null) {
      const stopped = new Promise((resolve) => server.once("exit", resolve));
      server.kill("SIGTERM");
      await stopped;
    }
    rmSync(temporary, { force: true, recursive: true });
  }

  async function sql(query) {
    return new Promise((resolve, reject) => {
      const child = spawn(
        join(binaries, "psql"),
        [
          "-X",
          "-qAt",
          "-v",
          "ON_ERROR_STOP=1",
          "-h",
          socket,
          "-p",
          "54329",
          "-U",
          "fixture",
          "-d",
          "postgres",
          "-c",
          query,
        ],
        { env: environment, stdio: ["ignore", "pipe", "pipe"] },
      );
      let output = "";
      let error = "";
      child.stdout.on("data", (chunk) => {
        output += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        error += chunk.toString();
      });
      child.on("error", reject);
      child.on("exit", (code) => (code === 0 ? resolve(output.trim()) : reject(new Error(error))));
    });
  }
  async function ready() {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null) throw new Error(`Disposable PostgreSQL exited: ${log}`);
      try {
        await sql("select 1");
        return;
      } catch {
        await delay(100);
      }
    }
    throw new Error(`Disposable PostgreSQL did not become ready: ${log}`);
  }
  async function setup() {
    await sql(`create schema auth;create role anon;create role authenticated;create role service_role bypassrls;
    grant usage on schema public,auth to authenticated,service_role;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create table public.portfolio_profiles(id text primary key,owner_id uuid,is_public boolean);
    grant select on public.portfolio_profiles to authenticated,service_role;`);
    for (const suffix of [
      "_premium_entitlements.sql",
      "_premium_chat_widget.sql",
      "_stripe_subscriptions.sql",
    ]) {
      const name = readdirSync("supabase/migrations").find((file) => file.endsWith(suffix));
      assert.ok(name, `Missing migration ${suffix}`);
      await sql(readFileSync(join("supabase/migrations", name), "utf8"));
    }
    await sql(`insert into auth.users values('${account}');
    insert into public.portfolio_profiles values('alpha','${account}',true);
    insert into public.billing_entitlements values('${account}','pro','active',now()-interval '1 day',now()+interval '29 days',3,3);
    insert into public.billing_assignments(account_id,profile_id,chat_enabled) values('${account}','alpha',true);`);
  }
  function reserve(feature, request = randomUUID(), profile = "alpha") {
    return sql(
      `set role service_role;select public.reserve_premium_usage('${account}','${profile}','${feature}','${request}')`,
    );
  }
  async function simultaneousReservations() {
    const results = await Promise.all(
      ["portfolio_chat", "studio_assistant"].map(async (feature) => {
        const reservations = await Promise.all(Array.from({ length: 12 }, () => reserve(feature)));
        assert.equal(
          reservations.filter((value) => value === "t").length,
          3,
          `${feature} allowance exceeded or undercounted`,
        );
        return feature;
      }),
    );
    assert.equal(results.length, 2);
    assert.equal(await sql("select count(*) from public.billing_usage"), "6");
    await sql("update public.billing_usage set outcome='failed'");
    assert.equal(await reserve("portfolio_chat"), "f");
    assert.equal(await reserve("studio_assistant"), "f");
  }
  async function duplicateAttempts() {
    await sql("delete from public.billing_usage");
    const id = randomUUID();
    const duplicates = await Promise.all(
      Array.from({ length: 12 }, () => reserve("studio_assistant", id)),
    );
    assert.equal(duplicates.filter((value) => value === "t").length, 1);
    assert.equal(await sql("select count(*) from public.billing_usage"), "1");
    assert.equal(await reserve("studio_assistant", randomUUID(), "another-portfolio"), "f");
    await sql("update public.billing_assignments set chat_enabled=false");
    assert.equal(await reserve("portfolio_chat"), "f");
    await sql("update public.portfolio_profiles set owner_id=null");
    assert.equal(await reserve("studio_assistant"), "f");
    await sql(`update public.portfolio_profiles set owner_id='${account}'`);
    await assert.rejects(
      sql(
        `set role authenticated;select public.reserve_premium_usage('${account}','alpha','studio_assistant','${randomUUID()}')`,
      ),
      /permission denied/,
    );
  }
  async function leaseAndReceipts() {
    const leases = Array.from({ length: 12 }, () => randomUUID());
    const claimed = await Promise.all(
      leases.map((lease) =>
        sql(`set role service_role;select public.claim_billing('${account}','${lease}')`),
      ),
    );
    assert.equal(claimed.filter((value) => value === "t").length, 1);
    const first = leases[claimed.indexOf("t")];
    await sql(
      "update public.billing_customers set lease_until=clock_timestamp()-interval '1 second'",
    );
    const current = randomUUID();
    assert.equal(
      await sql(`set role service_role;select public.claim_billing('${account}','${current}')`),
      "t",
    );
    const state = {
      chat: 3,
      editor: 3,
      end: "2030-02-01T00:00:00Z",
      start: "2030-01-01T00:00:00Z",
      status: "active",
    };
    const commit = (lease, event, value = state) =>
      sql(
        `set role service_role;select public.commit_billing('${account}','${lease}','${JSON.stringify(value)}'::jsonb,'${event}')`,
      );
    assert.equal(await commit(first, "evt_stale"), "f");
    assert.equal(await commit(current, "evt_confirmed"), "t");
    assert.equal(
      await commit(current, "evt_confirmed", { ...state, chat: 0, editor: 0, status: "inactive" }),
      "t",
    );
    assert.equal(await sql("select plan from public.billing_entitlements"), "pro");
    assert.equal(await sql("select count(*) from public.billing_events"), "1");
    await assert.rejects(
      commit(current, "evt_failed", { ...state, end: state.start }),
      /check constraint/,
    );
    assert.equal(
      await sql("select count(*) from public.billing_events where event_id='evt_failed'"),
      "0",
    );
    assert.equal(await sql("select plan from public.billing_entitlements"), "pro");
  }
});
