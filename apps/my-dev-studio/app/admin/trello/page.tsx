import { notFound } from "next/navigation";
import { Suspense } from "react";

import { StudioHeading } from "@shared/assistant/portfolio";
import { TrelloBoardDirectory } from "@shared/trello/pages";
import { TrelloService } from "@shared/trello/service";
import { StudioButton } from "@shared/ui/button";
import { Feedback } from "@shared/ui/feedback";
import { Skeleton } from "@shared/ui/skeleton";

import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

import { trelloConfig } from "./_config";

export const metadata = { title: "Trello boards" };

async function ConnectedBoards({
  config,
}: {
  config: NonNullable<ReturnType<typeof trelloConfig>>;
}) {
  const boards = await new TrelloService(config).boardService.getBoards();
  if (boards.success && boards.data) {
    return <TrelloBoardDirectory boards={boards.data} createHref="/admin/trello/new" />;
  }

  return (
    <Feedback
      description="Check the connection and the Trello token’s permissions."
      title="Could not load Trello boards"
      variant="danger"
    >
      <StudioButton href="/admin/trello" tone="secondary" variant="outline">
        Try again
      </StudioButton>
    </Feedback>
  );
}

function LoadingBoards() {
  return (
    <div aria-busy="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status">
      <span className="sr-only">Loading Trello boards…</span>
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
    </div>
  );
}

export default async function TrelloBoardsPage() {
  const admin = await requirePortfolioAdmin().catch(() => null);
  if (!admin) notFound();

  const config = trelloConfig();

  return (
    <main
      className="studio mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-8"
      id="admin-content"
    >
      <StudioHeading
        actions={config && <StudioButton href="/admin/trello/new">Create board</StudioButton>}
        description="Browse open boards from the connected Trello account."
        eyebrow="Platform administration"
        title="Trello boards"
      />
      {config ? (
        <Suspense fallback={<LoadingBoards />}>
          <ConnectedBoards config={config} />
        </Suspense>
      ) : (
        <Feedback
          description="Configure server-side Trello credentials to connect this workspace."
          title="Trello is not connected"
          variant="info"
        />
      )}
    </main>
  );
}
