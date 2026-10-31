"use client";
import { useEffect, useState } from "react";

import { z } from "zod";

const planSchema = z.object({
  amount: z.number().int().min(0),
  available: z.literal(true),
  chatLimit: z.number().int().min(1),
  currency: z.string().length(3),
  editorLimit: z.number().int().min(1),
  interval: z.literal("month"),
  mode: z.literal("test"),
});
export function PlanDetails() {
  const [plan, setPlan] = useState<z.infer<typeof planSchema> | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/billing/pricing", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        const value = planSchema.parse(await response.json());
        setPlan(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);
  if (failed)
    return (
      <p>Pro sandbox pricing is temporarily unavailable. Your free portfolio remains available.</p>
    );
  if (!plan) return <p role="status">Loading Pro test price…</p>;
  const digits = ["isk", "ugx"].includes(plan.currency.toLowerCase())
    ? 2
    : (new Intl.NumberFormat("en", { currency: plan.currency, style: "currency" }).resolvedOptions()
        .maximumFractionDigits ?? 2);
  const price = new Intl.NumberFormat("en", { currency: plan.currency, style: "currency" }).format(
    plan.amount / 10 ** digits,
  );
  return (
    <div>
      <p className="home-plan-price">
        {price}
        <span> / month · test price</span>
      </p>
      <p>
        {plan.chatLimit} visitor chat attempts and {plan.editorLimit} private assistant attempts per
        billing period.
      </p>
    </div>
  );
}
