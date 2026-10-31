import { createStripe, StripeBilling, stripeConfiguration } from "@shared/lib/stripe";
export async function publicPricing() {
  const config = stripeConfiguration();
  return new StripeBilling(createStripe(2500), config).publicPlan();
}
