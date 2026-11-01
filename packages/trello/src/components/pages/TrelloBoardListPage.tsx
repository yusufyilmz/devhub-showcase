"use client";

import { type CSSProperties, type FC, type ReactNode, useEffect, useState } from "react";

import { cn } from "cn";
import { shallow } from "zustand/shallow";

import { FlexCol } from "@shared/ui/flex";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

import { useTrelloStoreReady } from "../../hooks/useTrelloStoreReady";
import { trelloActions, trelloSelectors, useTrelloStore } from "../../stores/trelloStore";
import type { TrelloBoard as TrelloBoardType } from "../../types";
import { boardSurfaceStyle } from "../../utils";
import { TrelloBoard } from "../board/TrelloBoard";
import { TrelloBoardSidebar } from "../board/TrelloBoardSidebar";
import { TrelloErrorBoundary } from "../layout/TrelloErrorBoundary";

interface TrelloBoardListPageProps {
  className?: string;
  initialBoardId?: string;
  style?: CSSProperties;
}

function PageMessage({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("trello-board-page p-5", className)} style={style}>
      {children}
    </div>
  );
}

function BoardPlaceholder({ primary, secondary }: { primary: string; secondary?: string }) {
  return (
    <FlexCol
      align="center"
      className="h-full w-full justify-center bg-[#f4f5f7] p-6 text-center"
      justify="center"
    >
      <Typography color="muted" variant="large">
        {primary}
      </Typography>
      {secondary ? (
        <Typography className="mt-2" color="muted" variant="caption">
          {secondary}
        </Typography>
      ) : null}
    </FlexCol>
  );
}

/**
 * Multi-board Trello workspace: sidebar navigation plus the active board canvas.
 */
export const TrelloBoardListPage: FC<TrelloBoardListPageProps> = ({
  initialBoardId,
  className = "",
  style = {},
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const { isReady: storeReady, error: storeError } = useTrelloStoreReady();

  const storeState = useTrelloStore(
    (state) => ({
      boards: trelloSelectors.boards(state),
      error: trelloSelectors.error(state),
      hasBoards: trelloSelectors.hasBoards(state),
      loading: trelloSelectors.loading(state),
      selectedBoard: trelloSelectors.selectedBoard(state),
    }),
    shallow,
  );

  const { boards, selectedBoard, loading, error, hasBoards } = storeReady
    ? storeState
    : {
        boards: [],
        error: null,
        hasBoards: false,
        loading: {
          boards: true,
          cards: false,
          creating: false,
          currentMember: false,
          deleting: false,
          lists: false,
          members: false,
          updating: false,
        },
        selectedBoard: null,
      };

  useEffect(() => {
    const initializeApp = async () => {
      if (!storeReady) {
        logger("TrelloBoardListPage").info("Waiting for Trello store to be ready...");
        return;
      }
      if (!trelloActions?.healthCheck) {
        logger("TrelloBoardListPage").error("Trello store actions not available");
        return;
      }

      try {
        await trelloActions.healthCheck();
        await trelloActions.fetchCurrentMember();
        await trelloActions.fetchBoards();
      } catch (initError) {
        logger("TrelloBoardListPage").error("Failed to initialize app:", initError);
      }
    };

    initializeApp();
  }, [storeReady]);

  useEffect(() => {
    if (!storeReady || boards.length === 0) {
      return;
    }

    if (initialBoardId) {
      const initialBoard = boards.find((board) => board.id === initialBoardId);
      if (initialBoard) {
        void trelloActions.setSelectedBoard(initialBoard);
      }
      return;
    }

    if (boards.length === 1 && !selectedBoard) {
      trelloActions.setSelectedBoard(boards[0] ?? null);
    }
  }, [storeReady, initialBoardId, boards, selectedBoard]);

  const pageStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    height: "calc(100vh - 170px)",
    overflow: "hidden",
    width: "100%",
    ...style,
  };

  if (storeError) {
    return (
      <PageMessage className={className} style={style}>
        <Typography color="destructive" variant="large">
          Store initialization failed: {storeError}
        </Typography>
        <Typography className="mt-2" color="muted" variant="body2">
          Please check your configuration and try refreshing the page.
        </Typography>
      </PageMessage>
    );
  }

  if (!storeReady) {
    return (
      <PageMessage className={className} style={style}>
        <Typography color="muted" variant="large">
          Initializing Trello store…
        </Typography>
      </PageMessage>
    );
  }

  if (loading.boards && boards.length === 0) {
    return (
      <PageMessage className={className} style={style}>
        <Typography color="muted" variant="large">
          Loading your boards…
        </Typography>
      </PageMessage>
    );
  }

  if (error && !hasBoards) {
    return (
      <PageMessage className={className} style={style}>
        <Typography color="destructive" variant="large">
          {error}
        </Typography>
        <Typography className="mt-2" color="muted" variant="body2">
          Unable to load your boards. Please check your connection.
        </Typography>
      </PageMessage>
    );
  }

  if (!hasBoards && !loading.boards) {
    return (
      <PageMessage className={className} style={style}>
        <Typography color="muted" variant="large">
          No boards found. Create your first board to get started.
        </Typography>
      </PageMessage>
    );
  }

  return (
    <TrelloErrorBoundary>
      <div className={cn("trello-board-page", className)} style={pageStyle}>
        <TrelloErrorBoundary fallback={<div>Sidebar Error</div>}>
          <TrelloBoardSidebar
            collapsed={sidebarCollapsed}
            onBoardSelect={(board: TrelloBoardType) => trelloActions.setSelectedBoard(board)}
            onCreateBoard={() => {
              logger("TrelloBoardListPage").info("Create board clicked");
            }}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </TrelloErrorBoundary>

        <div className="min-w-0 flex-1 overflow-hidden">
          {selectedBoard ? (
            <TrelloErrorBoundary fallback={<div>Board Error</div>}>
              <TrelloBoard
                allowDragDrop
                board={selectedBoard}
                onBoardUpdate={(updatedBoard) => {
                  logger("TrelloBoardListPage").info("Board updated:", updatedBoard);
                }}
                onCardClick={(cardId) => {
                  setSelectedCardId(cardId);
                  logger("TrelloBoardListPage").info("Card clicked:", { cardId });
                }}
                showActions
                style={boardSurfaceStyle(selectedBoard)}
              />
            </TrelloErrorBoundary>
          ) : (
            <BoardPlaceholder
              primary="Select a board from the sidebar to get started"
              secondary="Choose from your available Trello boards"
            />
          )}
        </div>

        {selectedCardId ? (
          <div className="fixed bottom-5 right-5 rounded-md bg-[#0079bf] px-4 py-2 text-xs text-white shadow-md">
            <Typography as="span" className="text-white" variant="caption">
              Selected card: {selectedCardId}
            </Typography>
          </div>
        ) : null}
      </div>
    </TrelloErrorBoundary>
  );
};

export default TrelloBoardListPage;
