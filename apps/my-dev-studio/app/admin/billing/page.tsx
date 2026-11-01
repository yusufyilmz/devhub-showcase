import { redirect } from "next/navigation";

import { requireConfirmedUser } from "@shared/auth";
import { BillingSettings } from "@shared/components/studio";
import { createServerClient } from "@shared/lib/supabase";

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
  return <BillingSettings returned={returned} />;
}
