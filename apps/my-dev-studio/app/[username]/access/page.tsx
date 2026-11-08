import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioPasswordGate } from "@shared/assistant/password-gate";
import { readPortfolioAccessStatus } from "@shared/lib/published-profile";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  description: "Enter the password shared by the portfolio owner.",
  robots: { follow: false, index: false },
  title: "Protected portfolio | MyDevStudio",
};
export default async function AccessPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  if (!(await readPortfolioAccessStatus(username))) notFound();
  return <PortfolioPasswordGate username={username} />;
}
