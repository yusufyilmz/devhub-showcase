import Stripe from "stripe";
import { z } from "zod";

export function stripeConfiguration() {
  const input = z
    .object({
      chat: z.coerce.number().int().min(1).max(100000),
      editor: z.coerce.number().int().min(1).max(100000),
      key: z.string().startsWith("sk_test_"),
      origin: z.url(),
      price: z.string().startsWith("price_"),
      webhook: z.string().startsWith("whsec_"),
    })
    .parse({
      chat: process.env.STRIPE_PRO_CHAT_LIMIT,
      editor: process.env.STRIPE_PRO_EDITOR_LIMIT,
      key: process.env.STRIPE_SECRET_KEY,
      origin: process.env.NEXT_PUBLIC_SITE_URL,
      price: process.env.STRIPE_PRO_PRICE_ID,
      webhook: process.env.STRIPE_WEBHOOK_SECRET,
    });
  const url = new URL(input.origin);
  if (url.protocol !== "https:" && url.hostname !== "localhost")
    throw new Error("Invalid billing origin.");
  return { ...input, origin: url.origin };
}
export function createStripe(timeout = 15000) {
  return new Stripe(stripeConfiguration().key, { maxNetworkRetries: 0, timeout });
}
export type SubscriptionState = {
  subscription: string | null;
  status: "active" | "trialing" | "past_due" | "canceled" | "inactive";
  start: string;
  end: string;
  chat: number;
  editor: number;
};
export class StripeBilling {
  constructor(
    private readonly stripe: Stripe,
    private readonly config = stripeConfiguration(),
  ) {}
  async publicPlan() {
    const price = await this.stripe.prices.retrieve(this.config.price);
    validateMonthlyTestPrice(price);
    if (price.unit_amount === null) throw new Error("Flat monthly price required.");
    return {
      amount: price.unit_amount,
      available: true as const,
      chatLimit: this.config.chat,
      currency: price.currency,
      editorLimit: this.config.editor,
      interval: "month" as const,
      mode: "test" as const,
    };
  }
  async customer(account: string) {
    z.uuid().parse(account);
    const result = await this.stripe.customers.create(
      { metadata: { account_id: account } },
      { idempotencyKey: `mydevstudio-customer-${account}` },
    );
    return result.id;
  }
  async checkout(customer: string, key: string) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer,
      limit: 100,
      status: "all",
    });
    if (
      subscriptions.has_more ||
      subscriptions.data.some((s) => !["canceled", "incomplete_expired"].includes(s.status))
    )
      throw new Error("Manage your existing subscription instead.");
    const price = await this.stripe.prices.retrieve(this.config.price);
    validateMonthlyTestPrice(price);
    const session = await this.stripe.checkout.sessions.create(
      {
        cancel_url: `${this.config.origin}/admin/billing`,
        customer,
        line_items: [{ price: price.id, quantity: 1 }],
        mode: "subscription",
        subscription_data: { billing_mode: { type: "flexible" } },
        success_url: `${this.config.origin}/admin/billing?checkout=returned`,
      },
      { idempotencyKey: key },
    );
    if (!session.url) throw new Error("Checkout unavailable.");
    return { id: session.id, url: session.url };
  }
  async portal(customer: string) {
    return (
      await this.stripe.billingPortal.sessions.create({
        customer,
        return_url: `${this.config.origin}/admin/billing`,
      })
    ).url;
  }
  async state(customer: string): Promise<SubscriptionState> {
    const list = await this.stripe.subscriptions.list({ customer, limit: 100, status: "all" });
    if (list.has_more) throw new Error("Subscription review required.");
    const candidates = list.data.filter(
      (s) => !["canceled", "incomplete_expired"].includes(s.status),
    );
    if (candidates.length > 1) throw new Error("Multiple subscriptions require review.");
    const subscription = candidates[0];
    const item = subscription?.items.data[0];
    const valid =
      subscription &&
      !subscription.livemode &&
      subscription.items.data.length === 1 &&
      item?.price.id === this.config.price &&
      item.quantity === 1;
    const active = valid && ["active", "trialing"].includes(subscription.status);
    const start = valid ? item.current_period_start : Math.floor(Date.now() / 1000);
    const end = valid ? item.current_period_end : start + 1;
    return {
      chat: active ? this.config.chat : 0,
      editor: active ? this.config.editor : 0,
      end: new Date(end * 1000).toISOString(),
      start: new Date(start * 1000).toISOString(),
      status: active
        ? (subscription.status as "active" | "trialing")
        : subscription?.status === "past_due"
          ? "past_due"
          : "inactive",
      subscription: subscription?.id ?? null,
    };
  }
}

export type StripeEvent = Stripe.Event;

function validateMonthlyTestPrice(price: Stripe.Price) {
  if (
    price.livemode ||
    !price.active ||
    price.recurring?.interval !== "month" ||
    price.recurring.interval_count !== 1 ||
    price.recurring.usage_type !== "licensed" ||
    price.type !== "recurring" ||
    price.billing_scheme !== "per_unit"
  )
    throw new Error("Monthly test price required.");
}
