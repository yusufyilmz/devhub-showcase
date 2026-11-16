import { notFound } from "next/navigation";

import { StudioHeading } from "@shared/assistant/portfolio";
import { TrelloBoardCreateForm } from "@shared/trello/pages";
import { StudioButton } from "@shared/ui/button";
import { Feedback } from "@shared/ui/feedback";

import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

import { trelloConfig } from "../_config";
import { createTrelloBoard } from "./actions";

export const metadata = { title: "Create Trello board" };

export default async function CreateTrelloBoardPage() {
  const admin = await requirePortfolioAdmin().catch(() => null);
  if (!admin) notFound();

  return (
    <main
      className="studio mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-8"
      id="admin-content"
    >
      <StudioHeading
        description="The board will be created under the Trello account connected to this Studio."
        eyebrow="Trello boards"
        title="Create a Trello board"
      />
      {trelloConfig() ? (
        <TrelloBoardCreateForm action={createTrelloBoard} boardsHref="/admin/trello" />
      ) : (
        <Feedback
          description="Configure server-side Trello credentials before creating boards."
          title="Trello is not connected"
          variant="info"
        >
          <StudioButton href="/admin/trello" tone="secondary" variant="outline">
            Back to boards
          </StudioButton>
        </Feedback>
      )}
    </main>
  );
}
