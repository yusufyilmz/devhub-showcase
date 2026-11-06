import { IconButton } from "@shared/ui/icon-button";
import { FoldersIcon } from "@shared/ui/icons";

import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

export async function ManagementLink() {
  const admin = await requirePortfolioAdmin().catch(() => null);
  if (!admin) return null;
  return (
    <IconButton asChild className="rounded-full" surface="portfolio" variant="outline">
      <a aria-label="Manage portfolios" href="/admin/portfolios" title="Manage portfolios">
        <FoldersIcon aria-hidden="true" size={19} />
      </a>
    </IconButton>
  );
}
