import { notFound } from "next/navigation";

import { TrelloBoardWorkspace } from "@shared/trello/pages";
import { StudioButton } from "@shared/ui/button";
import { Feedback } from "@shared/ui/feedback";

import { openBoard } from "./_access";
import { readComments, updateBoard } from "./actions";

export const metadata = { title: "Trello board" };

export default async function TrelloWorkspacePage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const access = await openBoard(boardId);
  if (!access) notFound();
  const [lists, cards] = access.ok
    ? await Promise.all([
        access.service.getListsOnBoard(boardId),
        access.service.getCardsOnBoard(boardId),
      ])
    : [];

  return (
    <main
      className="studio mx-auto grid w-full max-w-screen-2xl gap-5 px-4 py-8 sm:px-8"
      id="admin-content"
    >
      <div>
        <StudioButton href="/admin/trello" tone="secondary">
          Back to boards
        </StudioButton>
      </div>
      {access.ok &&
      lists?.success &&
      Array.isArray(lists.data) &&
      cards?.success &&
      Array.isArray(cards.data) ? (
        <TrelloBoardWorkspace
          action={updateBoard.bind(null, boardId)}
          board={access.board}
          cards={cards.data.filter(({ closed }) => !closed)}
          lists={lists.data.filter(({ closed }) => !closed)}
          readComments={readComments.bind(null, boardId)}
        />
      ) : (
        <Feedback
          description="Check the connection and reload the board."
          title="Could not load this board"
          variant="danger"
        >
          <StudioButton href={`/admin/trello/boards/${boardId}`} tone="secondary">
            Try again
          </StudioButton>
        </Feedback>
      )}
    </main>
  );
}
