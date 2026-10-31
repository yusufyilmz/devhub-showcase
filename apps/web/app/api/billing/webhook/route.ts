import { billingGateway, synchronize } from "@/lib/billing/gateway";

export const runtime = "nodejs";
export async function POST(request: Request) {
  let gateway: ReturnType<typeof billingGateway>;
  try {
    gateway = billingGateway();
  } catch {
    return new Response("Billing unavailable", { status: 503 });
  }
  const raw = await request.text();
  if (raw.length > 1000000) return new Response("Payload too large", { status: 413 });
  let event: import("@shared/lib/stripe").StripeEvent;
  try {
    event = gateway.stripe.webhooks.constructEvent(
      raw,
      request.headers.get("stripe-signature") || "",
      gateway.config.webhook,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  if (event.livemode) return new Response("Test events required", { status: 400 });
  const supported = [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.paid",
    "invoice.payment_failed",
  ];
  if (!supported.includes(event.type)) return new Response("Ignored");
  const object = event.data.object;
  const customer = "customer" in object ? object.customer : null;
  const customerId = typeof customer === "string" ? customer : customer?.id;
  if (!customerId) return new Response("Invalid customer", { status: 400 });
  try {
    await synchronize(customerId, event.id);
    return new Response("Received");
  } catch {
    return new Response("Retry billing synchronization", { status: 503 });
  }
}
