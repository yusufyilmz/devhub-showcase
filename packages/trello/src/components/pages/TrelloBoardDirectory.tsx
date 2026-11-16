import { Badge } from "@shared/ui/badge";
import { StudioButton } from "@shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@shared/ui/cards";
import { EmptyState } from "@shared/ui/empty-state";
import { ExternalLinkIcon } from "@shared/ui/icons";
import { Typography } from "@shared/ui/typography";

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
}: {
  boards: TrelloBoard[];
  createHref: string;
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
    <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => {
        const href = trelloBoardHref(board);
        const permission = board.prefs?.permissionLevel;
        const label = permission ? visibility.get(permission) : undefined;

        return (
          <li className="min-w-0" key={board.id}>
            <Card className="flex h-full flex-col" interaction="static">
              <CardHeader className="flex flex-wrap items-start justify-between gap-2">
                <Typography as="h2" className="min-w-0 wrap-anywhere" variant="h5">
                  {board.name}
                </Typography>
                {label && <Badge variant="outline">{label}</Badge>}
              </CardHeader>
              {board.desc && (
                <CardContent className="line-clamp-3 wrap-anywhere text-sm text-muted-foreground">
                  {board.desc}
                </CardContent>
              )}
              {href && (
                <CardFooter className="mt-auto">
                  <StudioButton
                    aria-label={`Open ${board.name} in Trello`}
                    href={href}
                    tone="secondary"
                    variant="outline"
                  >
                    Open in Trello <ExternalLinkIcon aria-hidden="true" />
                  </StudioButton>
                </CardFooter>
              )}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
