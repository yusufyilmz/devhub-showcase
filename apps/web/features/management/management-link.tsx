import { requirePortfolioAdmin } from "@/lib/managed-portfolios";
export async function ManagementLink() {
  const admin = await requirePortfolioAdmin().catch(() => null);
  return admin ? (
    <a className="studio-secondary" href="/admin/portfolios">
      Manage portfolios
    </a>
  ) : null;
}
