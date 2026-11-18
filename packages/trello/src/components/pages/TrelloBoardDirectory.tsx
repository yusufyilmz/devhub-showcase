import { Badge } from "@shared/ui/badge";
import { Button, StudioButton } from "@shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@shared/ui/cards";
import { EmptyState } from "@shared/ui/empty-state";
import { DashboardIcon, ExternalLinkIcon } from "@shared/ui/icons";

import { trelloBoardHref } from "../../board-creation";
import type { TrelloBoard } from "../../types";

const visibility = new Map([
  ["org", "Workspace"],
  ["private", "Private"],
  ["public", "Public"],
]);

export function TrelloBoardDirectory({
  boards,
  createHref,
  boardHref,
}: {
  boards: TrelloBoard[];
  createHref: string;
  boardHref?: (boardId: string) => string;
}) {
  if (!boards.length) {
    return (
      <EmptyState
        description="Create a board for your next project."
        height="auto"
        title="No open boards"
      >
        <StudioButton href={createHref}>Create board</StudioButton>
      </EmptyState>
    );
  }

  return (
    <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => {
        const href = trelloBoardHref(board);
        const permission = board.prefs?.permissionLevel;
        const label = permission ? visibility.get(permission) : undefined;

        return (
          <li className="min-w-0" key={board.id}>
            <Card
              className="group flex h-full flex-col gap-0 overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
              interaction="static"
            >
              <CardHeader className="grid gap-3 border-b border-border/60 bg-linear-to-br from-primary/12 via-primary/4 to-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-lg border border-primary/15 bg-card text-primary [&_svg]:size-5">
                    <DashboardIcon aria-hidden="true" />
                  </span>
                  {label && <Badge variant="secondary">{label}</Badge>}
                </div>
                <h2 className="min-w-0 wrap-anywhere text-lg leading-snug font-semibold tracking-tight">
                  {board.name}
                </h2>
              </CardHeader>
              {board.desc && (
                <CardContent className="px-5 pt-4 text-sm text-muted-foreground">
                  <p className="line-clamp-3 wrap-anywhere">{board.desc}</p>
                </CardContent>
              )}
              <CardFooter className="mt-auto flex flex-wrap justify-between gap-2 p-4">
                {boardHref && (
                  <Button
                    aria-label={`Open board: ${board.name}`}
                    href={boardHref(board.id)}
                    size="sm"
                    variant="outline"
                  >
                    Open board
                  </Button>
                )}
                {href && (
                  <Button
                    aria-label={`Open ${board.name} in Trello`}
                    href={href}
                    size="sm"
                    variant={boardHref ? "ghost" : "outline"}
                  >
                    Open in Trello <ExternalLinkIcon aria-hidden="true" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
