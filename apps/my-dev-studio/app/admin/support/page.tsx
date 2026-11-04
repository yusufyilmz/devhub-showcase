import { redirect } from "next/navigation";

import { ProfileAccessError } from "@shared/services/profile";

import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";
import { SupportClient } from "@/features/support/support-client";

export const metadata = { robots: { follow: false, index: false }, title: "Account support" };
export const dynamic = "force-dynamic";
export default async function SupportPage() {
  try {
    await requirePortfolioAdmin();
  } catch (error) {
    if (error instanceof ProfileAccessError) redirect("/admin");
    throw error;
  }
  return <SupportClient />;
}
