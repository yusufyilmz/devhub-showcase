import { type CSSProperties, type FC, useEffect, useState } from "react";

import { cn } from "cn";
import { shallow } from "zustand/shallow";

import { Alert, AlertDescription } from "@shared/ui/alert";
import { Button, Button as LibraryButton } from "@shared/ui/button";
import { Flex, FlexCol } from "@shared/ui/flex";
import { TextField } from "@shared/ui/text-field";
import { Typography } from "@shared/ui/typography";

import { trelloActions, trelloSelectors, useTrelloStore } from "../../stores/trelloStore";
import type { TrelloBoard as TrelloBoardType } from "../../types";
import { TrelloList } from "../cards/TrelloList";
import { Heading } from "../ui";
import { TrelloBoardBackground } from "./TrelloBoardBackground";

const boardGhostButtonClass =
  "border border-white/30 bg-white/20 text-white hover:bg-white/30 hover:text-white";

interface BoardStatsProps {
  cardsCount: number;
  completedCards: number;
  listsCount: number;
}

const BoardStats: FC<BoardStatsProps> = ({ listsCount, cardsCount, completedCards }) => (
  <Flex className="text-sm text-white/90" gap="lg" wrap>
    <Typography as="span" variant="body2">
      📋 {listsCount} lists
    </Typography>
    <Typography as="span" variant="body2">
      🎴 {cardsCount} cards
    </Typography>
    {completedCards > 0 && (
      <Typography as="span" variant="body2">
        ✅ {completedCards} completed
      </Typography>
    )}
  </Flex>
);

interface ErrorAlertProps {
  error: string;
  onClose: () => void;
}

const ErrorAlert: FC<ErrorAlertProps> = ({ error, onClose }) => (
  <Alert
    className="mx-4 mb-2 border-destructive/40 bg-destructive/90 text-white"
    variant="destructive"
  >
    <Flex align="center" className="w-full" justify="between">
      <AlertDescription className="text-white">⚠️ {error}</AlertDescription>
      <Button
        className="text-white hover:bg-white/10"
        onClick={onClose}
        size="sm"
        type="button"
        variant="ghost"
      >
        ✕
      </Button>
    </Flex>
  </Alert>
);

const LoadingState: FC = () => (
  <Flex align="center" className="flex-1 text-lg text-white/80" justify="center">
    <Typography color="muted" variant="body1">
      Loading board...
    </Typography>
  </Flex>
);

interface EmptyBoardStateProps {
  onAddList: () => void;
  showActions: boolean;
}

const EmptyBoardState: FC<EmptyBoardStateProps> = ({ showActions, onAddList }) => (
  <FlexCol
    align="center"
    className="flex-1 px-10 py-10 text-center text-white/80"
    gap="md"
    justify="center"
  >
    <span aria-hidden className="text-5xl">
      📋
    </span>
    <FlexCol align="center" gap="sm">
      <Heading className="m-0 text-white" level={3}>
        This board is empty
      </Heading>
      <Typography className="text-white/70" variant="body2">
        Add your first list to get started organizing your work!
      </Typography>
    </FlexCol>
    {showActions && (
      <Button onClick={onAddList} type="button" variant="default">
        Create your first list
      </Button>
    )}
  </FlexCol>
);

interface AddListColumnProps {
  isAddingList: boolean;
  loading: boolean;
  newListName: string;
  onAdd: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
  onStartAdding: () => void;
}

const AddListColumn: FC<AddListColumnProps> = ({
  isAddingList,
  newListName,
  onNameChange,
  onAdd,
  onCancel,
  onStartAdding,
  loading,
}) => (
  <div className="mx-2 w-[272px] max-w-[272px] shrink-0">
    {isAddingList ? (
      <div className="bg-card border-border rounded-lg border p-3 shadow-sm">
        <FlexCol gap="sm">
          <TextField
            autoFocus
            fullWidth
            onChange={(event) => onNameChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onAdd();
              if (event.key === "Escape") onCancel();
            }}
            placeholder="Enter list name..."
            value={newListName}
          />
          <Flex gap="sm">
            <Button
              disabled={!newListName.trim() || loading}
              onClick={onAdd}
              size="sm"
              type="button"
            >
              {loading ? "Adding..." : "Add List"}
            </Button>
            <Button onClick={onCancel} size="sm" type="button" variant="ghost">
              Cancel
            </Button>
          </Flex>
        </FlexCol>
      </div>
    ) : (
      <Button
        className={cn("h-10 w-full", boardGhostButtonClass)}
        onClick={onStartAdding}
        type="button"
        variant="ghost"
      >
        + Add another list
      </Button>
    )}
  </div>
);

interface TrelloBoardProps {
  allowDragDrop?: boolean;
  board: TrelloBoardType;
  className?: string;
  onBoardUpdate?: (board: TrelloBoardType) => void;
  onCardClick?: (cardId: string) => void;
  showActions?: boolean;
  style?: CSSProperties;
}

export const TrelloBoard: FC<TrelloBoardProps> = ({
  board,
  className = "",
  style = {},
  onBoardUpdate,
  onCardClick,
  showActions = true,
}) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(board.name);

  const { lists, cards, loading, error } = useTrelloStore(
    (state) => ({
      cards: trelloSelectors.cardsByBoard(board.id)(state),
      error: trelloSelectors.error(state),
      lists: trelloSelectors.listsByBoard(board.id)(state),
      loading: trelloSelectors.loading(state),
    }),
    shallow,
  );

  useEffect(() => {
    setEditTitle(board.name);
  }, [board.name]);

  useEffect(() => {
    const loadBoardData = async () => {
      await Promise.all([
        trelloActions.fetchBoardLists(board.id),
        trelloActions.fetchBoardCards(board.id),
      ]);
    };
    void loadBoardData();
  }, [board.id]);

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    const newList = await trelloActions.createList(board.id, newListName.trim(), "bottom");
    if (newList) {
      setNewListName("");
      setIsAddingList(false);
    }
  };

  const handleCancelAddList = () => {
    setNewListName("");
    setIsAddingList(false);
  };

  const handleUpdateTitle = async () => {
    if (editTitle.trim() && editTitle.trim() !== board.name) {
      await trelloActions.updateBoardApi(board.id, { name: editTitle.trim() });
      onBoardUpdate?.({ ...board, name: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditTitle(board.name);
    setIsEditingTitle(false);
  };

  const sortedLists = [...lists].sort((a, b) => a.pos - b.pos);
  const boardStats = {
    cardsCount: cards.length,
    completedCards: cards.filter((card) => card.dueComplete).length,
    listsCount: lists.length,
  };

  return (
    <TrelloBoardBackground board={board} className={className}>
      <FlexCol
        className={cn("trello-board h-full", className)}
        data-board-id={board.id}
        data-testid="trello-board"
        gap="md"
        style={style}
      >
        <div className="mx-4 rounded-lg bg-black/30 p-4 text-white backdrop-blur-sm">
          <FlexCol gap="sm">
            <Flex align="center" justify="between" wrap>
              <Flex align="center" className="min-w-0 flex-1" gap="lg" wrap>
                {isEditingTitle ? (
                  <TextField
                    autoFocus
                    className="min-w-[300px] text-2xl font-bold"
                    fullWidth
                    onBlur={() => void handleUpdateTitle()}
                    onChange={(event) => setEditTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") void handleUpdateTitle();
                      if (event.key === "Escape") handleCancelEditTitle();
                    }}
                    value={editTitle}
                  />
                ) : (
                  <LibraryButton
                    className={cn(
                      "rounded-md px-3 py-2 text-left transition-colors",
                      showActions && "hover:bg-white/10 cursor-pointer",
                    )}
                    disabled={!showActions}
                    onClick={() => showActions && setIsEditingTitle(true)}
                    title={showActions ? "Click to edit board name" : undefined}
                    type="button"
                    variant="unstyled"
                  >
                    <Heading className="m-0 text-2xl text-white" level={1}>
                      {board.name}
                    </Heading>
                  </LibraryButton>
                )}

                <BoardStats
                  cardsCount={boardStats.cardsCount}
                  completedCards={boardStats.completedCards}
                  listsCount={boardStats.listsCount}
                />
              </Flex>

              {showActions && (
                <Flex gap="sm" wrap>
                  <Button
                    className={boardGhostButtonClass}
                    disabled={loading.creating}
                    onClick={() => setIsAddingList(true)}
                    type="button"
                    variant="ghost"
                  >
                    {loading.creating ? "Adding..." : "+ Add List"}
                  </Button>
                  <Button
                    className={boardGhostButtonClass}
                    onClick={() => window.open(board.url, "_blank")}
                    type="button"
                    variant="ghost"
                  >
                    🔗 Open in Trello
                  </Button>
                </Flex>
              )}
            </Flex>

            {board.desc && (
              <Typography className="leading-snug text-white/90" variant="body2">
                {board.desc}
              </Typography>
            )}
          </FlexCol>
        </div>

        {error && <ErrorAlert error={error} onClose={trelloActions.clearError} />}

        <div className="flex min-w-fit flex-1 gap-4 overflow-x-auto overflow-y-hidden px-4 pb-12">
          {loading.lists ? (
            <LoadingState />
          ) : (
            <>
              {sortedLists.map((list) => (
                <TrelloList
                  key={list.id}
                  list={list}
                  onCardClick={onCardClick}
                  showActions={showActions}
                />
              ))}

              {showActions && (
                <AddListColumn
                  isAddingList={isAddingList}
                  loading={loading.creating}
                  newListName={newListName}
                  onAdd={() => void handleAddList()}
                  onCancel={handleCancelAddList}
                  onNameChange={setNewListName}
                  onStartAdding={() => setIsAddingList(true)}
                />
              )}

              {sortedLists.length === 0 && !loading.lists && (
                <EmptyBoardState
                  onAddList={() => setIsAddingList(true)}
                  showActions={showActions}
                />
              )}
            </>
          )}
        </div>
      </FlexCol>
    </TrelloBoardBackground>
  );
};
