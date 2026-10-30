import { requirePortfolioAdmin } from "../../lib/managed-portfolios";
export async function ManagementLink() {
  const admin = await requirePortfolioAdmin().catch(() => null);
  return admin ? (
    <a href="/admin/portfolios" className="studio-secondary">
      Manage portfolios
    </a>
  ) : null;
}
