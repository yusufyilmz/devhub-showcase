import { requireConfirmedUser } from "@shared/auth";
import { createServerClient } from "@shared/lib/supabase";
import { redirect } from "next/navigation";

import { PlanDetails } from "@/features/billing/plan-details";
import { ChatSettings } from "./chat-settings";
import { BillingControls } from "./controls";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  try {
    await requireConfirmedUser(await createServerClient());
  } catch {
    redirect("/admin/login");
  }
  const returned = (await searchParams).checkout === "returned";
  return (
    <main className="studio-shell">
      <section className="editor-card">
        <h1>Subscription settings</h1>
        <p>
          Stripe test environment. No live payments are enabled. Pro includes optional visitor chat
          and private editing proposals.
        </p>
        <p>
          Checkout displays the configured monthly test price. AI allowances count reserved
          attempts, including failed or uncertain provider requests.
        </p>
        <PlanDetails />
        {returned && (
          <p role="status">
            You returned from Stripe checkout. The plan below reflects confirmed account access;
            returning here does not activate Pro. If your new subscription is not shown yet, wait a
            moment and use Refresh status. Subscription updates arrive through Stripe confirmation.
          </p>
        )}
        <BillingControls />
        <ChatSettings />
        <a href="/admin">Back to your portfolio</a>
      </section>
    </main>
  );
}
