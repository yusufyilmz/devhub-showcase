import { readdirSync, readFileSync } from "node:fs";

import { PGlite } from "@electric-sql/pglite";
import { expect, it, vi } from "vitest";

import { StripeBilling, stripeConfiguration } from "../packages/lib/src/billing/stripe";

const config = {
  chat: 100,
  editor: 10,
  key: "sk_test_fake",
  origin: "https://example.test",
  price: "price_pro",
  webhook: "whsec_fake",
};
it("rejects live keys and incomplete configuration", () => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_fake");
  expect(() => stripeConfiguration()).toThrow();
  vi.unstubAllEnvs();
});
it("blocks duplicate subscriptions and uses only server price and fixed return URLs", async () => {
  const create = vi
    .fn()
    .mockResolvedValue({ id: "cs_test", url: "https://checkout.stripe.com/test" });
  const list = vi.fn().mockResolvedValue({ data: [{ status: "active" }], has_more: false });
  const sdk = {
    checkout: { sessions: { create } },
    prices: {
      retrieve: vi.fn().mockResolvedValue({
        active: true,
        id: "price_pro",
        livemode: false,
        recurring: { interval: "month", interval_count: 1 },
        type: "recurring",
      }),
    },
    subscriptions: { list },
  };
  const billing = new StripeBilling(
    sdk as unknown as ConstructorParameters<typeof StripeBilling>[0],
    config,
  );
  await expect(billing.checkout("cus_test", "key")).rejects.toThrow("existing");
  expect(create).not.toHaveBeenCalled();
  list.mockResolvedValue({ data: [], has_more: false });
  await billing.checkout("cus_test", "stable-key");
  expect(create.mock.calls[0]?.[0].success_url).toBe(
    "https://example.test/admin/billing?checkout=returned",
  );
  expect(create.mock.calls[0]?.[1]).toEqual({ idempotencyKey: "stable-key" });
});
it("grants allowances only for the configured test subscription", async () => {
  const item = {
    current_period_end: 200,
    current_period_start: 100,
    price: { id: "price_pro" },
    quantity: 1,
  };
  const subscription = {
    id: "sub_test",
    items: { data: [item] },
    livemode: false,
    status: "active",
  };
  const list = vi.fn().mockResolvedValue({ data: [subscription], has_more: false });
  const billing = new StripeBilling(
    { subscriptions: { list } } as unknown as ConstructorParameters<typeof StripeBilling>[0],
    config,
  );
  expect((await billing.state("cus_test")).chat).toBe(100);
  list.mockResolvedValue({ data: [{ ...subscription, status: "past_due" }], has_more: false });
  expect((await billing.state("cus_test")).chat).toBe(0);
  list.mockResolvedValue({ data: [{ ...subscription, livemode: true }], has_more: false });
  expect((await billing.state("cus_test")).status).toBe("inactive");
});
it("fences stale webhook workers and atomically commits event receipts with grants", async () => {
  const db = new PGlite();
  const account = "11111111-1111-4111-8111-111111111111";
  const lease = crypto.randomUUID();
  try {
    await db.exec(`create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role bypassrls;grant usage on schema public to service_role;
 create table public.billing_entitlements(account_id uuid primary key,plan text,status text,period_start timestamptz,period_end timestamptz,chat_limit int,editor_limit int);grant all on public.billing_entitlements to service_role;`);
    const file = readdirSync("supabase/migrations").find((n) =>
      n.endsWith("_stripe_subscriptions.sql"),
    );
    if (!file) throw new Error("Missing migration");
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
    await db.query("insert into auth.users values ($1)", [account]);
    await db.exec("set role authenticated");
    await expect(
      db.query("select public.claim_billing($1,$2)", [account, lease]),
    ).rejects.toThrow();
    await db.exec("reset role;set role service_role");
    const claim = async (token: string) =>
      (await db.query<{ ok: boolean }>("select public.claim_billing($1,$2) ok", [account, token]))
        .rows[0]?.ok;
    expect(await claim(lease)).toBe(true);
    expect(await claim(crypto.randomUUID())).toBe(false);
    const state = {
      chat: 100,
      editor: 10,
      end: "2026-11-01T00:00:00Z",
      start: "2026-10-01T00:00:00Z",
      status: "active",
    };
    const commit = async (token: string, event: string) =>
      (
        await db.query<{ ok: boolean }>("select public.commit_billing($1,$2,$3,$4) ok", [
          account,
          token,
          state,
          event,
        ])
      ).rows[0]?.ok;
    expect(await commit(crypto.randomUUID(), "evt_bad")).toBe(false);
    expect(await commit(lease, "evt_1")).toBe(true);
    expect(await commit(lease, "evt_1")).toBe(true);
    expect((await db.query("select * from public.billing_events")).rows).toHaveLength(1);
    await db.exec(
      "update public.billing_customers set lease_until=clock_timestamp()-interval '1 second'",
    );
    expect(await commit(lease, "evt_expired")).toBe(false);
  } finally {
    await db.close();
  }
}, 20000);
