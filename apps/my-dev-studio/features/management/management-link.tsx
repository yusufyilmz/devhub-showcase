import { DashboardIcon } from "@shared/ui/display";

import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

const manageLinkClass =
  "icon-button inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary)] text-sm font-medium text-[var(--primary-foreground)] ring-offset-[var(--background)] transition-colors hover:bg-[var(--primary)]/90 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:outline-none";

export async function ManagementLink() {
  const admin = await requirePortfolioAdmin().catch(() => null);
  if (!admin) return null;
  return (
    <a aria-label="Manage portfolios" className={manageLinkClass} href="/admin/portfolios">
      <DashboardIcon fontSize="small" />
    </a>
  );
}
