import { notFound } from "next/navigation";

import { CreatePortfolio } from "../../../features/management/create-portfolio";
import { requirePortfolioAdmin } from "../../../lib/managed-portfolios";
import "../../../features/management/management.css";
export default async function PortfolioManager({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  let admin: Awaited<ReturnType<typeof requirePortfolioAdmin>>;
  try {
    admin = await requirePortfolioAdmin();
  } catch {
    notFound();
  }
  const raw = Number((await searchParams).page ?? 0);
  const page = Number.isSafeInteger(raw) && raw >= 0 ? Math.min(raw, 100000) : 0;
  const { data, error } = await admin.client
    .from("portfolio_profiles")
    .select("id, username, is_public, document, updated_at")
    .eq("managed_by", admin.user.id)
    .is("owner_id", null)
    .order("updated_at", { ascending: false })
    .range(page * 50, page * 50 + 50);
  return (
    <main className="studio managed-dashboard" id="admin-content">
      <div className="studio-heading">
        <div>
          <p className="eyebrow">PLATFORM ADMINISTRATION</p>
          <h1>Manage portfolios</h1>
          <p>Create temporary portfolios, import content and manage publishing.</p>
        </div>
        <a className="studio-secondary" href="/admin">
          My portfolio
        </a>
      </div>
      <CreatePortfolio />
      <section className="editor-card">
        <h2>Managed portfolios</h2>
        {error ? (
          <p role="alert">
            Could not load portfolios. Apply the managed portfolio migration and try again.
          </p>
        ) : (
          <>
            <ul className="managed-records">
              {(data ?? []).slice(0, 50).map((row) => {
                const profile = row.document as {
                  name?: string;
                  portfolioType?: string;
                };
                return (
                  <li key={row.id}>
                    <div>
                      <h3>{profile.name ?? row.username}</h3>
                      <p>
                        /{row.username} · {profile.portfolioType ?? "engineer"} ·{" "}
                        {row.is_public ? "Published" : "Private draft"}
                      </p>
                    </div>
                    <div className="managed-actions">
                      <a href={`/admin/portfolios/${row.id}`}>Edit portfolio ↗</a>
                      {row.is_public && <a href={`/${row.username}`}>Public page ↗</a>}
                    </div>
                  </li>
                );
              })}
            </ul>
            {!data?.length && <p>No temporary portfolios yet.</p>}
            <nav aria-label="Managed portfolio pages">
              {page > 0 && <a href={`?page=${page - 1}`}>Previous page</a>}
              {(data?.length ?? 0) > 50 && <a href={`?page=${page + 1}`}>Next page</a>}
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
