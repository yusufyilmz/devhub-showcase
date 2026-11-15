import { redirect } from "next/navigation";

import { StudioHeading } from "@shared/assistant/portfolio";
import { requireConfirmedUser } from "@shared/auth";
import { BillingSettings } from "@shared/billing/components";
import { createServerClient } from "@shared/lib/supabase";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  try {
    await requireConfirmedUser(await createServerClient());
  } catch {
    redirect("/login");
  }
  const returned = (await searchParams).checkout === "returned";
  return (
    <BillingSettings
      heading={
        <StudioHeading
          description="Review your plan and usage. Pro adds optional visitor chat and private editing proposals."
          eyebrow="Account and billing"
          title="Subscription settings"
        />
      }
      returned={returned}
    />
  );
}
