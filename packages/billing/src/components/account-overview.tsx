import { Card } from "@shared/ui/cards";

import { type BillingSummary, premiumFeatureStatus } from "../features/premium-status";

const planLabels: Record<BillingSummary["access"], string> = {
  active: "Pro is active",
  canceled: "Pro subscription canceled",
  expired: "Pro access has expired",
  free: "You are on Free",
  inactive: "Pro is inactive",
  past_due: "Payment needs attention",
  scheduled: "Pro access has not started yet",
};
const featureLabels = {
  disabled: "Visitor chat is switched off. Enable it below when you are ready.",
  exhausted: "No attempts remain for this period. Check your plan after the period ends.",
  legacy: "Your existing portfolio assistant keeps its legacy configuration.",
  ready: "Ready to use. Availability is checked again for each request.",
  requires_pro: "An active Pro plan is required. Your free portfolio and CV remain available.",
  setup_required:
    "AI service setup is incomplete. Contact the site administrator, then refresh status.",
  unassigned: "Assign Pro to this portfolio using the button below.",
  unpublished: "Your portfolio is private. Publish it in the editor before visitors can use chat.",
};
export type AccountStatus = {
  billing: BillingSummary;
  aiConfigured: boolean;
  profile: { id: string; isPublic: boolean };
};
export function AccountOverview({ billing, aiConfigured, profile }: AccountStatus) {
  return (
    <section aria-labelledby="account-plan-title">
      <h3 className="mt-5 mb-2 text-lg leading-[1.65] font-semibold" id="account-plan-title">
        {planLabels[billing.access]}
      </h3>
      {billing.access === "past_due" && (
        <p>Open Manage subscription to review your test payment method.</p>
      )}
      {billing.periodEnd && (
        <p>
          Access period ends:{" "}
          <time dateTime={billing.periodEnd}>
            {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
              new Date(billing.periodEnd),
            )}
          </time>
          .
        </p>
      )}
      <p>
        Publication: {profile.isPublic ? "Public" : "Private"}. Assignment:{" "}
        {billing.assignedProfileId === profile.id
          ? "This portfolio"
          : "Not assigned to this portfolio"}
        .
      </p>
      {(["studio_assistant", "portfolio_chat"] as const).map((feature) => {
        const label = feature === "studio_assistant" ? "Private editing assistant" : "Visitor chat";
        const status = premiumFeatureStatus(billing, profile, feature, aiConfigured);
        return (
          <Card asChild key={feature} layout="plain" surface="portfolio">
            <section className="my-4 p-5 shadow-none!">
              <h4 className="mb-2 text-base leading-[1.65] font-semibold">{label}</h4>
              <p>{featureLabels[status]}</p>
              {status !== "legacy" && (
                <>
                  <p>
                    {billing.usage[feature]} / {billing.limits[feature]} attempts used.{" "}
                    {Math.max(0, billing.limits[feature] - billing.usage[feature])} remaining.
                  </p>
                  <progress
                    aria-label={`${label} usage`}
                    className="h-2 w-full max-w-80 accent-[rgb(var(--accent-rgb))]"
                    max={Math.max(1, billing.limits[feature])}
                    value={Math.min(billing.usage[feature], Math.max(1, billing.limits[feature]))}
                  />
                </>
              )}
            </section>
          </Card>
        );
      })}
      <p>
        Failed or uncertain requests count as attempts. Refresh status after testing an assistant or
        returning from Stripe. Status checks do not send prompts, consume attempts or change your
        subscription.
      </p>
    </section>
  );
}
