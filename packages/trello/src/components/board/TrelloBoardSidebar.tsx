"use client";

import { type CSSProperties, type FC, type ReactNode, useState } from "react";

import { cn } from "cn";
import { shallow } from "zustand/shallow";

import { Button } from "@shared/ui/button";
import { Flex, FlexCol } from "@shared/ui/flex";
import { IconButton } from "@shared/ui/icon-button";
import { TextField } from "@shared/ui/text-field";
import { Typography } from "@shared/ui/typography";

import { trelloActions, trelloSelectors, useTrelloStore } from "../../stores/trelloStore";
import type { TrelloBoard } from "../../types";
import { Heading } from "../ui";

const trelloAccent = "border-[#0079bf] bg-[#0079bf]/10 text-[#0079bf] hover:bg-[#0079bf]/15";

interface BoardIconProps {
  board: TrelloBoard;
  compact?: boolean;
  isSelected?: boolean;
  onClick?: (board: TrelloBoard) => void;
}

const BoardIcon: FC<BoardIconProps> = ({ board, isSelected = false, onClick, compact = false }) => {
  const backgroundColor = board.prefs?.backgroundColor || "#0079bf";

  if (compact) {
    return (
      <IconButton
        aria-label={board.name}
        className={cn(
          "size-10",
          isSelected ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
        )}
        onClick={() => onClick?.(board)}
        title={board.name}
        type="button"
        variant="ghost"
      >
        📋
      </IconButton>
    );
  }

  return (
    <Button
      className={cn(
        "h-auto w-full justify-start gap-2 p-3 text-left",
        isSelected
          ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-card border-border text-foreground hover:bg-muted border",
      )}
      onClick={() => onClick?.(board)}
      type="button"
      variant={isSelected ? "default" : "outline"}
    >
      <span aria-hidden className="size-6 shrink-0 rounded-sm" style={{ backgroundColor }} />
      <FlexCol className="min-w-0 flex-1" gap="xs">
        <Typography as="span" className="truncate font-medium" variant="body2">
          {board.name}
        </Typography>
        <Typography as="span" className="truncate" color="muted" variant="caption">
          {board.desc || "No description"}
        </Typography>
      </FlexCol>
    </Button>
  );
};

interface StatsProps {
  totalBoards: number;
  totalCards: number;
  totalLists: number;
}

const Stats: FC<StatsProps> = ({ totalBoards, totalLists, totalCards }) => (
  <div className="border-border bg-muted/40 text-muted-foreground rounded-lg border p-3 text-xs">
    <FlexCol gap="xs">
      <Flex justify="between">
        <Typography variant="caption">Total Boards:</Typography>
        <Typography className="font-semibold" variant="caption">
          {totalBoards}
        </Typography>
      </Flex>
      <Flex justify="between">
        <Typography variant="caption">Total Lists:</Typography>
        <Typography className="font-semibold" variant="caption">
          {totalLists}
        </Typography>
      </Flex>
      <Flex justify="between">
        <Typography variant="caption">Total Cards:</Typography>
        <Typography className="font-semibold" variant="caption">
          {totalCards}
        </Typography>
      </Flex>
    </FlexCol>
  </div>
);

interface SidebarShellProps {
  children: ReactNode;
  className?: string;
  collapsed: boolean;
  "data-testid"?: string;
  style?: CSSProperties;
}

const SidebarShell: FC<SidebarShellProps> = ({
  children,
  className,
  collapsed,
  style,
  "data-testid": dataTestId,
}) => (
  <aside
    className={cn(
      "border-border bg-background flex h-full shrink-0 flex-col border-r",
      collapsed ? "w-[60px]" : "w-[280px]",
      className,
    )}
    data-testid={dataTestId}
    style={style}
  >
    {children}
  </aside>
);

interface TrelloBoardSidebarProps {
  className?: string;
  collapsed?: boolean;
  onBoardSelect?: (board: TrelloBoard) => void;
  onCreateBoard?: () => void;
  onToggleCollapse?: () => void;
  style?: CSSProperties;
}

export const TrelloBoardSidebar: FC<TrelloBoardSidebarProps> = ({
  className = "",
  style = {},
  onBoardSelect,
  onCreateBoard,
  collapsed = false,
  onToggleCollapse,
}) => {
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const { boards, selectedBoard, loading, currentMember, lists, cards } = useTrelloStore(
    (state) => ({
      boards: trelloSelectors.boards(state),
      cards: trelloSelectors.cards(state),
      currentMember: trelloSelectors.currentMember(state),
      lists: trelloSelectors.lists(state),
      loading: trelloSelectors.loading(state),
      selectedBoard: trelloSelectors.selectedBoard(state),
    }),
    shallow,
  );

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    const newBoard = await trelloActions.createBoard({
      defaultLists: true,
      desc: `Created by ${currentMember?.fullName || "User"}`,
      name: newBoardName.trim(),
      prefs_permissionLevel: "private",
    });

    if (newBoard) {
      setNewBoardName("");
      setIsCreatingBoard(false);
      onBoardSelect?.(newBoard);
    }
  };

  const handleCancelCreate = () => {
    setNewBoardName("");
    setIsCreatingBoard(false);
  };

  const createBoardTrigger = () => {
    if (onCreateBoard) {
      onCreateBoard();
      return;
    }
    setIsCreatingBoard(true);
  };

  if (collapsed) {
    return (
      <SidebarShell
        className={cn("trello-board-sidebar--collapsed", className)}
        collapsed
        data-testid="trello-board-sidebar-collapsed"
        style={style}
      >
        <FlexCol align="center" className="px-2 py-4" gap="sm">
          <IconButton
            aria-label="Expand sidebar"
            className="bg-[#0079bf] size-10 text-white hover:bg-[#0079bf]/90"
            onClick={onToggleCollapse}
            title="Expand sidebar"
            type="button"
          >
            ▶
          </IconButton>

          {boards.slice(0, 5).map((board) => (
            <BoardIcon
              board={board}
              compact
              isSelected={board.id === selectedBoard?.id}
              key={board.id}
              onClick={onBoardSelect}
            />
          ))}

          <IconButton
            aria-label="Create new board"
            className={cn("size-10 border border-dashed text-lg", trelloAccent)}
            onClick={createBoardTrigger}
            title="Create new board"
            type="button"
            variant="ghost"
          >
            +
          </IconButton>
        </FlexCol>
      </SidebarShell>
    );
  }

  return (
    <SidebarShell
      className={cn("trello-board-sidebar", className)}
      collapsed={false}
      data-testid="trello-board-sidebar"
      style={style}
    >
      <FlexCol className="h-full p-4" gap="md">
        <Flex align="center" justify="between">
          <Heading className="m-0 text-base font-semibold" level={5}>
            Your Boards
          </Heading>
          <IconButton
            aria-label="Collapse sidebar"
            className="text-muted-foreground"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            type="button"
            variant="ghost"
          >
            ◀
          </IconButton>
        </Flex>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading.boards ? (
            <div className="p-5 text-center">
              <Typography color="muted" variant="body2">
                Loading boards...
              </Typography>
            </div>
          ) : boards.length === 0 ? (
            <div className="p-5 text-center">
              <Typography color="muted" variant="body2">
                No boards found
              </Typography>
            </div>
          ) : (
            <FlexCol gap="xs">
              {boards.map((board) => (
                <BoardIcon
                  board={board}
                  isSelected={board.id === selectedBoard?.id}
                  key={board.id}
                  onClick={onBoardSelect}
                />
              ))}
            </FlexCol>
          )}
        </div>

        <div className="border-border rounded-lg border p-3">
          {isCreatingBoard ? (
            <FlexCol gap="sm">
              <TextField
                autoFocus
                fullWidth
                onChange={(event) => setNewBoardName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void handleCreateBoard();
                  if (event.key === "Escape") handleCancelCreate();
                }}
                placeholder="Enter board name..."
                value={newBoardName}
              />
              <Flex gap="sm">
                <Button
                  className="flex-1"
                  disabled={!newBoardName.trim() || loading.creating}
                  onClick={() => void handleCreateBoard()}
                  size="sm"
                  type="button"
                >
                  {loading.creating ? "Creating..." : "Create"}
                </Button>
                <Button onClick={handleCancelCreate} size="sm" type="button" variant="ghost">
                  Cancel
                </Button>
              </Flex>
            </FlexCol>
          ) : (
            <Button
              className={cn("h-10 w-full border-dashed", trelloAccent)}
              onClick={createBoardTrigger}
              type="button"
              variant="outline"
            >
              <Flex align="center" gap="sm">
                <span aria-hidden className="text-base leading-none">
                  +
                </span>
                <Typography variant="body2">Create new board</Typography>
              </Flex>
            </Button>
          )}
        </div>

        <Stats totalBoards={boards.length} totalCards={cards.length} totalLists={lists.length} />
      </FlexCol>
    </SidebarShell>
  );
};
