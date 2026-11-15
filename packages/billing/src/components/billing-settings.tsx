import type { ReactNode } from "react";

import { BillingProvider } from "../provider/billing-context";
import type { BillingRequest } from "../types";
import { BillingControls } from "./billing-controls";
import { ChatSettings } from "./chat-settings";
import { StudioPlanDetails } from "./plan-details";

export function BillingSettings({
  heading,
  request,
  returned = false,
}: {
  heading: ReactNode;
  request?: BillingRequest;
  returned?: boolean;
}) {
  return (
    <BillingProvider request={request}>
      <main
        className="mx-auto mt-10 mb-20 w-[min(960px,calc(100%_-_40px))] text-sm leading-[1.65] text-[var(--foreground)]"
        id="admin-content"
      >
        {heading}
        <section className="mb-[18px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-[clamp(20px,4vw,40px)] [&_button]:mb-3 [&_p]:mb-4 [&_p]:max-w-[75ch] [&_p]:text-[var(--muted-foreground)]">
          <p>Stripe test environment. Use test cards for checkout.</p>
          <p>
            Checkout displays the configured monthly test price. AI allowances count reserved
            attempts, including failed or uncertain provider requests.
          </p>
          <StudioPlanDetails />
          {returned && (
            <p role="status">
              You returned from Stripe checkout. The plan below reflects confirmed account access;
              returning here does not activate Pro. If your new subscription is not shown yet, wait
              a moment and use Refresh status. Subscription updates arrive through Stripe
              confirmation.
            </p>
          )}
          <BillingControls />
          <ChatSettings />
          <a className="text-[var(--primary)] underline-offset-4" href="/admin">
            Back to your portfolio
          </a>
        </section>
      </main>
    </BillingProvider>
  );
}
