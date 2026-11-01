"use client";

import { type FC, type ReactNode, useEffect, useState } from "react";

import { cn } from "cn";
import { shallow } from "zustand/shallow";

import { useNotification } from "@shared/runtime/notifications";
import { FlexCol } from "@shared/ui/flex";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

import {
  initializeApiService,
  trelloActions,
  trelloSelectors,
  useTrelloStore,
} from "../../stores/trelloStore";
import type {
  TrelloBoard as TrelloBoardType,
  TrelloCard,
  TrelloList,
  TrelloMember,
} from "../../types";
import { boardSurfaceStyle } from "../../utils";
import { TrelloBoard } from "../board/TrelloBoard";
import { TrelloErrorBoundary } from "../layout/TrelloErrorBoundary";

interface TrelloBoardPageSSRProps {
  boardId: string;
  initialData: {
    board: TrelloBoardType;
    lists: TrelloList[];
    cards: TrelloCard[];
    members: TrelloMember[];
  };
}

function PageCenter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <FlexCol
      align="center"
      className={cn("min-h-screen w-full justify-center gap-4 p-6", className)}
      justify="center"
    >
      {children}
    </FlexCol>
  );
}

/**
 * Server-hydrated single-board view: seeds the store from SSR data and renders the full board UI.
 */
export const TrelloBoardPage: FC<TrelloBoardPageSSRProps> = ({ initialData }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const initializeStore = async () => {
      try {
        initializeApiService();

        trelloActions.setBoards([initialData.board]);
        trelloActions.setSelectedBoard(initialData.board);
        trelloActions.setLists(initialData.lists);
        trelloActions.setCards(initialData.cards);
        trelloActions.setMembers(initialData.members);
        trelloActions.setCurrentMember(initialData.members[0] || null);

        setIsInitialized(true);
        showSuccess(`Board "${initialData.board.name}" loaded successfully!`);
      } catch (error) {
        logger("TrelloBoardPageSSR").error("Failed to initialize Trello store:", { error });
        const errorMessage = error instanceof Error ? error.message : "Failed to initialize";
        setInitError(errorMessage);
        showError(`Failed to load board: ${errorMessage}`);
      }
    };

    initializeStore();
  }, [initialData, showError, showSuccess]);

  const { selectedBoard, error } = useTrelloStore(
    (state) => ({
      error: trelloSelectors.error(state),
      selectedBoard: trelloSelectors.selectedBoard(state),
    }),
    shallow,
  );

  if (!isInitialized) {
    return (
      <PageCenter>
        <Typography variant="large">Loading board…</Typography>
        <Typography color="muted" variant="body2">
          Initializing {initialData.board.name}
        </Typography>
      </PageCenter>
    );
  }

  if (initError) {
    return (
      <PageCenter>
        <Typography color="destructive" variant="large">
          Failed to load board
        </Typography>
        <Typography color="muted" variant="body2">
          {initError}
        </Typography>
      </PageCenter>
    );
  }

  if (error) {
    return (
      <PageCenter>
        <Typography color="destructive" variant="large">
          Board error
        </Typography>
        <Typography color="muted" variant="body2">
          {error}
        </Typography>
      </PageCenter>
    );
  }

  return (
    <TrelloErrorBoundary>
      <div className="flex h-screen w-screen flex-col overflow-hidden">
        {selectedBoard ? (
          <TrelloErrorBoundary fallback={<div>Board Error</div>}>
            <TrelloBoard
              allowDragDrop
              board={selectedBoard}
              onBoardUpdate={(updatedBoard) => {
                logger("TrelloBoardPage").info("Board updated:", updatedBoard);
              }}
              onCardClick={(cardId) => {
                logger("TrelloBoardPage").info("Card clicked:", { cardId });
              }}
              showActions
              style={boardSurfaceStyle(selectedBoard)}
            />
          </TrelloErrorBoundary>
        ) : (
          <PageCenter className="min-h-0 flex-1 bg-[#f4f5f7]">
            <Typography color="muted" variant="large">
              Board not found
            </Typography>
            <Typography className="mt-2" color="muted" variant="caption">
              The requested board could not be loaded
            </Typography>
          </PageCenter>
        )}
      </div>
    </TrelloErrorBoundary>
  );
};

export default TrelloBoardPage;
