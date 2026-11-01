import { useCallback, useEffect, useState } from "react";

import type { BoardService } from "../services/BoardService";
import type { TrelloBoard, TrelloCard, TrelloList } from "../types";

interface UseTrelloBoardViewOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseTrelloBoardViewReturn {
  addCard: (listId: string, cardName: string, description?: string) => Promise<TrelloCard | null>;
  cards: TrelloCard[];
  deleteCard: (cardId: string) => Promise<boolean>;
  error: string | null;
  getCardsForList: (listId: string) => TrelloCard[];
  lists: TrelloList[];
  loading: boolean;
  moveCard: (cardId: string, targetListId: string, position?: number) => Promise<TrelloCard | null>;
  refreshBoard: () => Promise<void>;
  updateCard: (cardId: string, updates: Partial<TrelloCard>) => Promise<TrelloCard | null>;
}

export const useTrelloBoardView = (
  trelloService: BoardService,
  board: TrelloBoard,
  options: UseTrelloBoardViewOptions = {},
): UseTrelloBoardViewReturn => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [lists, setLists] = useState<TrelloList[]>([]);
  const [cards, setCards] = useState<TrelloCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, showError] = useState<string | null>(null);

  const refreshBoard = useCallback(async () => {
    setLoading(true);
    showError(null);

    try {
      // Load lists and cards in parallel
      const [listsResponse, cardsResponse] = await Promise.all([
        trelloService.getListsOnBoard(board.id),
        trelloService.getCardsOnBoard(board.id),
      ]);

      if (listsResponse.success && listsResponse.data) {
        setLists(listsResponse.data);
      } else {
        throw new Error(listsResponse.error || "Failed to load lists");
      }

      if (cardsResponse.success && cardsResponse.data) {
        setCards(cardsResponse.data);
      } else {
        throw new Error(cardsResponse.error || "Failed to load cards");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load board data";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [trelloService, board.id]);

  const addCard = useCallback(
    async (listId: string, cardName: string, description?: string): Promise<TrelloCard | null> => {
      try {
        const response = await trelloService.createCard(listId, {
          desc: description || "",
          name: cardName,
        });

        if (response.success && response.data) {
          setCards((prev) => [...prev, response.data as TrelloCard]);
          return response.data;
        }

        showError(response.error || "Failed to add card");
        return null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to add card";
        showError(errorMessage);
        return null;
      }
    },
    [trelloService],
  );

  const updateCard = useCallback(
    async (cardId: string, updates: Partial<TrelloCard>): Promise<TrelloCard | null> => {
      try {
        const response = await trelloService.updateCard(cardId, updates);

        if (response.success && response.data) {
          setCards((prev) =>
            prev.map((card) => (card.id === cardId ? { ...card, ...response.data } : card)),
          );
          return response.data;
        }

        showError(response.error || "Failed to update card");
        return null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update card";
        showError(errorMessage);
        return null;
      }
    },
    [trelloService],
  );

  const deleteCard = useCallback(
    async (cardId: string): Promise<boolean> => {
      try {
        const response = await trelloService.deleteCard(cardId);

        if (response.success) {
          setCards((prev) => prev.filter((card) => card.id !== cardId));
          return true;
        }

        showError(response.error || "Failed to delete card");
        return false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete card";
        showError(errorMessage);
        return false;
      }
    },
    [trelloService],
  );

  const moveCard = useCallback(
    async (cardId: string, targetListId: string, position?: number): Promise<TrelloCard | null> => {
      try {
        const response = await trelloService.moveCard(cardId, targetListId, position);

        if (response.success && response.data) {
          setCards((prev) =>
            prev.map((card) => (card.id === cardId ? { ...card, idList: targetListId } : card)),
          );
          return response.data;
        }

        showError(response.error || "Failed to move card");
        return null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to move card";
        showError(errorMessage);
        return null;
      }
    },
    [trelloService],
  );

  const getCardsForList = useCallback(
    (listId: string): TrelloCard[] => {
      return cards.filter((card) => card.idList === listId);
    },
    [cards],
  );

  // Initial load
  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(refreshBoard, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshBoard]);

  return {
    addCard,
    cards,
    deleteCard,
    error,
    getCardsForList,
    lists,
    loading,
    moveCard,
    refreshBoard,
    updateCard,
  };
};
