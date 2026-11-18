import { notFound } from "next/navigation";
import { Suspense } from "react";

import { TrelloBoardDirectory } from "@shared/trello/pages";
import { TrelloService } from "@shared/trello/service";
import { Button, StudioButton } from "@shared/ui/button";
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
    return (
      <TrelloBoardDirectory
        boardHref={(boardId) => `/admin/trello/boards/${encodeURIComponent(boardId)}`}
        boards={boards.data}
        createHref="/admin/trello/new"
      />
    );
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
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div className="grid gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Trello boards</h1>
          <p className="text-sm text-muted-foreground">
            Manage boards from your connected Trello account.
          </p>
        </div>
        {config && <Button href="/admin/trello/new">Create board</Button>}
      </header>
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
