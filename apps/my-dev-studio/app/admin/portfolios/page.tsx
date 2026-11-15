import { notFound } from "next/navigation";

import { StudioHeading } from "@shared/assistant/portfolio";
import { StudioButton } from "@shared/ui/button";

import { CreatePortfolio } from "@/features/management/create-portfolio";
import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

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
    <main
      className="studio [max-width:1160px] [padding:var(--studio-top,_36px)_40px_var(--studio-bottom,_80px)] [margin:auto] max-[767px]:[padding:var(--studio-top,_20px)_18px_var(--studio-bottom,_50px)] [&.studio-editor]:[max-width:none] [padding:0_32px_96px_0] max-[767px]:[&.studio-editor]:[padding:20px_16px_104px] [--studio-bottom:0px] grid gap-8 [--studio-heading-gap:0px]"
      id="admin-content"
    >
      <StudioHeading
        actions={
          <StudioButton href="/admin" tone="secondary" variant="outline">
            My portfolio
          </StudioButton>
        }
        description="Create temporary portfolios, import content and manage publishing."
        eyebrow="Platform administration"
        title="Manage portfolios"
      />
      <CreatePortfolio />
      <section className="editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]">
        <h2>Managed portfolios</h2>
        {error ? (
          <p role="alert">
            Could not load portfolios. Apply the managed portfolio migration and try again.
          </p>
        ) : (
          <>
            <ul className="list-none p-0">
              {(data ?? []).slice(0, 50).map((row) => {
                const profile = row.document as {
                  name?: string;
                  portfolioType?: string;
                };
                return (
                  <li
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] py-6"
                    key={row.id}
                  >
                    <div>
                      <h3 className="mb-2">{profile.name ?? row.username}</h3>
                      <p className="leading-[1.7] wrap-anywhere text-[var(--muted-foreground)]">
                        /{row.username} · {profile.portfolioType ?? "engineer"} ·{" "}
                        {row.is_public ? "Published" : "Private draft"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 [&_a]:text-[var(--primary)]">
                      <a href={`/admin/portfolios/${row.id}`}>Edit portfolio ↗</a>
                      {row.is_public && <a href={`/${row.username}`}>Public page ↗</a>}
                    </div>
                  </li>
                );
              })}
            </ul>
            {!data?.length && <p>No temporary portfolios yet.</p>}
            <nav aria-label="Managed portfolio pages" className="mt-4 flex gap-4">
              {page > 0 && <a href={`?page=${page - 1}`}>Previous page</a>}
              {(data?.length ?? 0) > 50 && <a href={`?page=${page + 1}`}>Next page</a>}
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
