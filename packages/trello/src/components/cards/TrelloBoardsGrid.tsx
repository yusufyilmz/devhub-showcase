"use client";

import { type FC, useState } from "react";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Flex } from "@shared/ui/flex";
import { Input } from "@shared/ui/input";
import { Spinner } from "@shared/ui/spinner";
import { Textarea } from "@shared/ui/textarea";
import { Typography } from "@shared/ui/typography";

import { useTrelloBoards } from "../../hooks/useTrelloBoards";
import type { BoardService } from "../../services/BoardService";
import type { TrelloBoard } from "../../types";
import { TrelloBoardCard } from "./TrelloBoardCard";

interface TrelloBoardsGridProps {
  onBoardSelect?: (board: TrelloBoard) => void;
  onBoardView?: (board: TrelloBoard) => void;
  trelloService: BoardService;
}

export const TrelloBoardsGrid: FC<TrelloBoardsGridProps> = ({
  trelloService,
  onBoardSelect,
  onBoardView,
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");

  // Note: selectedBoard available if needed later
  // const { selectedBoard } = useTrelloStore(
  //   (state) => ({
  //     selectedBoard: trelloSelectors.selectedBoard(state),
  //   }),
  //   shallow
  // )

  const { boards, loading, error, refetch, createBoard, deleteBoard } = useTrelloBoards(
    trelloService,
    {
      autoFetch: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    },
  );

  const handleBoardClick = (board: TrelloBoard) => {
    onBoardSelect?.(board);
  };

  const handleBoardEdit = () => {
    // TODO: Implement board editing
  };

  const handleBoardDelete = async (boardId: string) => {
    await deleteBoard(boardId);
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    const newBoard = await createBoard(newBoardName.trim(), newBoardDescription.trim());

    if (newBoard) {
      setShowCreateDialog(false);
      setNewBoardName("");
      setNewBoardDescription("");
    }
  };

  const resetCreateForm = () => {
    setNewBoardName("");
    setNewBoardDescription("");
    setShowCreateDialog(false);
  };

  if (loading && boards.length === 0) {
    return (
      <Flex gap="none" horizontal="center" style={{ minHeight: "400px" }} vertical="center">
        <Spinner size={32} />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        direction="column"
        gap="md"
        horizontal="center"
        style={{ minHeight: "400px" }}
        vertical="center"
      >
        <Typography style={{ color: "var(--danger-500)" }} variant="body2">
          Error loading boards: {error}
        </Typography>
        <Button onClick={refetch} variant="secondary">
          Try Again
        </Button>
      </Flex>
    );
  }

  return (
    <>
      <Flex direction="column" gap="lg">
        {/* Header */}
        <Flex gap="md" horizontal="between" vertical="center" wrap>
          <div>
            <Typography as="h1" variant="h1">
              Trello Boards
            </Typography>
            <Typography style={{ color: "var(--neutral-600)" }} variant="body2">
              {boards.length} {boards.length === 1 ? "board" : "boards"} available
            </Typography>
          </div>

          <Flex gap="sm">
            <Button disabled={loading} onClick={refetch} variant="secondary">
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button onClick={() => setShowCreateDialog(true)} variant="default">
              Create Board
            </Button>
          </Flex>
        </Flex>

        {/* Boards Grid */}
        {boards.length === 0 ? (
          <Flex
            border="subtle"
            direction="column"
            gap="md"
            horizontal="center"
            padding="xl"
            radius="md"
            style={{ minHeight: 300 }}
            vertical="center"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="48"
              stroke="var(--neutral-on-background-weak)"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="48"
            >
              <rect height="7" width="7" x="3" y="3" />
              <rect height="7" width="7" x="14" y="3" />
              <rect height="7" width="7" x="14" y="14" />
              <rect height="7" width="7" x="3" y="14" />
            </svg>

            <Typography as="h3" style={{ textAlign: "center" }} variant="h5">
              No boards found
            </Typography>
            <Typography
              color="muted"
              style={{
                maxWidth: "300px",
                textAlign: "center",
              }}
              variant="small"
            >
              Create your first Trello board to get started
            </Typography>
            <Button onClick={() => setShowCreateDialog(true)} variant="default">
              Create Board
            </Button>
          </Flex>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "var(--space-m)",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {boards.map((board) => (
              <TrelloBoardCard
                board={board}
                key={board.id}
                onBoardClick={handleBoardClick}
                onBoardDelete={handleBoardDelete}
                onBoardEdit={handleBoardEdit}
                onBoardView={onBoardView}
              />
            ))}
          </div>
        )}
      </Flex>

      {/* Create Board Dialog */}
      <Dialog onOpenChange={(open) => !open && resetCreateForm()} open={showCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <Flex direction="column" gap="lg" style={{ minWidth: "400px" }}>
            <div>
              <Typography className="mb-1" variant="small">
                Board Name *
              </Typography>
              <Input
                autoFocus
                className="w-full"
                id="board-name"
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter board name..."
                value={newBoardName}
              />
            </div>

            <div>
              <Typography className="mb-1" variant="small">
                Description (Optional)
              </Typography>
              <Textarea
                id="board-description"
                onChange={(e) => setNewBoardDescription(e.target.value)}
                placeholder="Enter board description..."
                rows={3}
                style={{ width: "100%" }}
                value={newBoardDescription}
              />
            </div>

            <Flex gap="sm" horizontal="end">
              <Button disabled={loading} onClick={resetCreateForm} variant="secondary">
                Cancel
              </Button>
              <Button
                disabled={!newBoardName.trim() || loading}
                onClick={handleCreateBoard}
                variant="default"
              >
                {loading ? "Creating..." : "Create Board"}
              </Button>
            </Flex>
          </Flex>
        </DialogContent>
      </Dialog>
    </>
  );
};
