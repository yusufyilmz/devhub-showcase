import { createStripe, StripeBilling, stripeConfiguration } from "@shared/lib/stripe";

import { billingServiceClient } from "./client";

export function billingGateway() {
  const config = stripeConfiguration();
  const db = billingServiceClient();
  const stripe = createStripe();
  return { config, db, service: new StripeBilling(stripe, config), stripe };
}
export async function withBillingLease<T>(
  account: string,
  action: (gateway: ReturnType<typeof billingGateway>, lease: string) => Promise<T>,
) {
  const gateway = billingGateway();
  const lease = crypto.randomUUID();
  const claimed = await gateway.db.rpc("claim_billing", { p_account: account, p_lease: lease });
  if (claimed.error || claimed.data !== true)
    throw new Error("Billing busy or unavailable. Please retry.");
  try {
    return await action(gateway, lease);
  } finally {
    await gateway.db
      .from("billing_customers")
      .update({ lease: null, lease_until: null })
      .eq("account_id", account)
      .eq("lease", lease);
  }
}
export async function checkout(account: string) {
  return withBillingLease(account, async ({ db, stripe, service }, lease) => {
    const record = await db
      .from("billing_customers")
      .select("customer_id,checkout_id,checkout_key")
      .eq("account_id", account)
      .single();
    if (record.error) throw new Error("Billing unavailable.");
    const customer = record.data.customer_id || (await service.customer(account));
    const saved = await db
      .from("billing_customers")
      .update({ customer_id: customer })
      .eq("account_id", account)
      .eq("lease", lease)
      .select("account_id")
      .single();
    if (saved.error) throw new Error("Billing unavailable.");
    if (record.data.checkout_id) {
      const previous = await stripe.checkout.sessions.retrieve(record.data.checkout_id);
      if (previous.status === "open" && previous.url) return previous.url;
    }
    const checkoutKey = await nextCheckoutKey(db, account, lease, {
      key: record.data.checkout_key,
      previous: record.data.checkout_id,
    });
    const session = await service.checkout(customer, `checkout-${account}-${checkoutKey}`);
    const result = await db
      .from("billing_customers")
      .update({ checkout_id: session.id })
      .eq("account_id", account)
      .eq("lease", lease)
      .select("account_id")
      .single();
    if (result.error) throw new Error("Could not save checkout. Please retry.");
    return session.url;
  });
}
export async function portal(account: string) {
  const gateway = billingGateway();
  const record = await gateway.db
    .from("billing_customers")
    .select("customer_id")
    .eq("account_id", account)
    .single();
  if (record.error || !record.data.customer_id) throw new Error("No billing customer.");
  return gateway.service.portal(record.data.customer_id);
}
export async function synchronize(customer: string, eventId: string) {
  const gateway = billingGateway();
  const record = await gateway.db
    .from("billing_customers")
    .select("account_id")
    .eq("customer_id", customer)
    .maybeSingle();
  if (record.error) throw new Error("Billing unavailable.");
  // Other products in the same Stripe account must not grant this app access.
  if (!record.data) return;
  const account = record.data.account_id;
  await withBillingLease(account, async ({ db, service }, lease) => {
    const state = await service.state(customer);
    const result = await db.rpc("commit_billing", {
      p_account: account,
      p_event: eventId,
      p_lease: lease,
      p_state: state,
    });
    if (result.error || result.data !== true) throw new Error("Could not synchronize billing.");
  });
}

async function nextCheckoutKey(
  db: ReturnType<typeof billingGateway>["db"],
  account: string,
  lease: string,
  { previous, key }: { previous: string | null; key: string },
) {
  if (!previous) return key;
  const checkoutKey = crypto.randomUUID();
  const result = await db
    .from("billing_customers")
    .update({ checkout_id: null, checkout_key: checkoutKey })
    .eq("account_id", account)
    .eq("lease", lease)
    .select("account_id")
    .single();
  if (result.error) throw new Error("Billing unavailable.");
  return checkoutKey;
}
