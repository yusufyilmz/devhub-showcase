import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PGlite } from "@electric-sql/pglite";

describe("Job Hunter database", () => {
  it("isolates accounts and atomically records scans, matches, retries and alerts", async () => {
    const db = new PGlite();
    try {
      await db.exec(`
        create role anon;
        create role authenticated;
        create role service_role bypassrls;
        create schema auth;
        create table auth.users (id uuid primary key, email text not null);
        create function auth.uid() returns uuid language sql stable as $$
          select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
        $$;
        grant usage on schema auth to authenticated, service_role, anon;
      `);
      await db.exec(readFileSync("supabase/migrations/20261112174836_job_hunter.sql", "utf8"));
      await expect(
        db.exec(readFileSync("supabase/tests/job-hunter.sql", "utf8")),
      ).resolves.toBeDefined();
    } finally {
      await db.close();
    }
  });
});
