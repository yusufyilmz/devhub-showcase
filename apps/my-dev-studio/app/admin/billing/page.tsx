import { redirect } from "next/navigation";

import { requireConfirmedUser } from "@shared/auth";
import { createServerClient } from "@shared/lib/supabase";

import { BillingSettings } from "@/features/studio";

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
  return <BillingSettings returned={returned} />;
}
