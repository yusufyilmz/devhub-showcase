"use client";

import { type FC, type MouseEvent, useState } from "react";

import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Flex } from "@shared/ui/flex";
import { IconButton } from "@shared/ui/icon-button";
import { Typography } from "@shared/ui/typography";

import { TRELLO_LABEL_COLORS } from "../../constants";
import type { TrelloBoardCardProps } from "../../types";

export const TrelloBoardCard: FC<TrelloBoardCardProps> = ({
  board,
  onBoardClick,
  onBoardView,
  onBoardEdit,
  onBoardDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCardClick = () => {
    onBoardClick?.(board);
  };

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onBoardEdit?.(board);
  };

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onBoardDelete?.(board.id);
    setShowDeleteDialog(false);
  };

  const getBoardColor = () => {
    const bgColor = board.prefs?.backgroundColor;
    if (bgColor) {
      const colorMatch = TRELLO_LABEL_COLORS.find((c) => c.value === bgColor);
      return colorMatch?.hex || "var(--brand-solid)";
    }
    return "var(--brand-solid)";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Flex
        as="article"
        background="card"
        border="subtle"
        className="trello-board-card transition-colors"
        cursor="pointer"
        onClick={handleCardClick}
        overflow="hidden"
        position="relative"
        radius="md"
        style={{ minHeight: 200 }}
      >
        {/* Simple color accent bar */}
        <div
          style={{
            backgroundColor: getBoardColor(),
            height: "3px",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        />

        <Flex direction="column" fitHeight gap="md" padding="md">
          {/* Clean header */}
          <Flex gap="sm" horizontal="between" vertical="start">
            <Typography
              as="h3"
              style={{
                color: "var(--neutral-on-background-strong)",
                flex: 1,
                fontWeight: 600,
                lineHeight: 1.3,
              }}
              variant="h5"
            >
              {board.name}
            </Typography>

            <Flex gap="xs">
              <IconButton
                aria-label="Edit board"
                onClick={handleEditClick}
                size="sm"
                variant="ghost"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </IconButton>
              <IconButton
                aria-label="Delete board"
                onClick={handleDeleteClick}
                size="sm"
                variant="ghost"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <polyline points="3,6 5,6 21,6" />
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                </svg>
              </IconButton>
            </Flex>
          </Flex>

          {/* Description */}
          {board.desc && (
            <Typography
              color="muted"
              style={{
                display: "-webkit-box",
                lineHeight: 1.4,
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
              variant="small"
            >
              {board.desc}
            </Typography>
          )}

          {/* Simple stats */}
          <Flex gap="sm" style={{ marginTop: "auto" }} wrap>
            {board.lists && <Badge>{board.lists.length} Lists</Badge>}

            {board.memberships && <Badge>{board.memberships.length} Members</Badge>}

            <Badge>{board.closed ? "Closed" : "Active"}</Badge>
          </Flex>

          {/* Clean footer */}
          <Flex gap="none" horizontal="between" paddingTop="sm" vertical="center">
            <Typography color="muted" variant="caption">
              {formatDate(board.dateLastActivity)}
            </Typography>

            <Flex gap="sm">
              {onBoardView && (
                <Button
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onBoardView(board);
                  }}
                  size="sm"
                  variant="default"
                >
                  View
                </Button>
              )}
              <Button onClick={handleCardClick} size="sm" variant="secondary">
                Open
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Delete Confirmation Dialog */}
      <Dialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
          </DialogHeader>
          <Flex direction="column" gap="md">
            <Typography variant="body2">
              Are you sure you want to delete the board "{board.name}"? This action cannot be
              undone.
            </Typography>

            <Flex gap="sm" horizontal="end">
              <Button onClick={() => setShowDeleteDialog(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="destructive">
                Delete Board
              </Button>
            </Flex>
          </Flex>
        </DialogContent>
      </Dialog>
    </>
  );
};
