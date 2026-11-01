import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { createComponentLogger } from "@shared/utils/client-logger";

import { CLIENT_TRELLO_CONFIG } from "../constants";
import { BoardService } from "../services/BoardService";
import type {
  CreateBoardOptions,
  CreateCardOptions,
  TrelloApiResponse,
  TrelloBoard,
  TrelloCard,
  TrelloList,
  TrelloLoadingState,
  TrelloMember,
  TrelloServiceConfig,
  TrelloStore,
  UpdateCardOptions,
} from "../types";

type TrelloSet = (
  partial: Partial<TrelloStore> | ((state: TrelloStore) => Partial<TrelloStore>),
  replace: false,
  action: string,
) => void;

const ARTICLE_CUSTOM_FIELDS = [
  { key: "articleId", name: "Article ID" },
  { key: "articleLink", name: "Article Link" },
  { key: "articleTitle", name: "Article Title" },
  { key: "convertedFrom", name: "Converted From" },
  { key: "convertedDate", name: "Converted Date" },
] as const;

function caughtMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function logStoreException(message: string, details: Record<string, unknown>, error: unknown) {
  storeLogger.error(message, details, undefined, error instanceof Error ? error : undefined);
}

function storeFetchFailure(
  set: TrelloSet,
  action: string,
  errorMsg: string,
  logMessage: string,
  details: Record<string, unknown>,
) {
  storeLogger.error(logMessage, { ...details, error: errorMsg });
  set({ error: errorMsg }, false, action);
}

function applyFetchedBoard(
  set: TrelloSet,
  boardId: string,
  response: TrelloApiResponse<TrelloBoard>,
) {
  if (response.success && response.data) {
    const board = response.data;
    storeLogger.info("Board fetched successfully", {
      action: "fetchBoard",
      boardDesc: board.desc?.substring(0, 100) + (board.desc?.length > 100 ? "..." : ""),
      boardId,
      boardName: board.name,
    });
    set(
      (state) => ({
        boards: state.boards.map((boardItem) => (boardItem.id === boardId ? board : boardItem)),
        error: null,
      }),
      false,
      "trello/fetchBoard/success",
    );
    return board;
  }

  storeFetchFailure(
    set,
    "trello/fetchBoard/error",
    response.error || "Failed to fetch board",
    "Failed to fetch board",
    { action: "fetchBoard", boardId },
  );
  return null;
}

function applyMemberBoards(
  set: TrelloSet,
  memberId: string | undefined,
  response: TrelloApiResponse<TrelloBoard[]>,
) {
  const memberLabel = memberId || "current";
  if (response.success && response.data) {
    storeLogger.info("Member boards fetched successfully", {
      action: "fetchMemberBoards",
      boardCount: response.data.length,
      boardNames: response.data.map((board) => board.name),
      memberId: memberLabel,
    });
    set({ boards: response.data, error: null }, false, "trello/fetchMemberBoards/success");
    return;
  }

  storeFetchFailure(
    set,
    "trello/fetchMemberBoards/error",
    response.error || "Failed to fetch member boards",
    "Failed to fetch member boards",
    { action: "fetchMemberBoards", memberId: memberLabel },
  );
}

async function ensureArticleFields(
  service: BoardService,
  boardId: string,
  fieldMap: Map<string, { id: string }>,
) {
  for (const fieldDef of ARTICLE_CUSTOM_FIELDS) {
    if (fieldMap.has(fieldDef.name)) continue;
    const createResponse = await service.createCustomField(boardId, {
      display: { cardFront: false },
      name: fieldDef.name,
      type: "text",
    });
    if (createResponse.success && createResponse.data) {
      fieldMap.set(fieldDef.name, createResponse.data);
    }
  }
}

function collectArticleFields(
  articleData: {
    articleId?: string;
    articleLink?: string;
    articleTitle?: string;
    convertedDate?: string;
    convertedFrom?: string;
  },
  fieldMap: Map<string, { id: string }>,
) {
  const customFields = [];
  for (const fieldDef of ARTICLE_CUSTOM_FIELDS) {
    const value = articleData[fieldDef.key];
    const field = fieldMap.get(fieldDef.name);
    if (value && field) {
      customFields.push({
        idCustomField: field.id,
        value: { text: value },
      });
    }
  }
  return customFields;
}

// Initialize API service with default config
let apiService: BoardService | null = null;

// Create logger for Trello store operations
const storeLogger = createComponentLogger("TrelloStore");

export const initializeApiService = (config: TrelloServiceConfig = CLIENT_TRELLO_CONFIG) => {
  if (!apiService) {
    storeLogger.debug("Initializing Trello API service", {
      config: { ...config, apiKey: "[REDACTED]", token: "[REDACTED]" },
    });
    apiService = new BoardService(config);
    storeLogger.info("Trello API service initialized successfully");
  }
  return apiService;
};

export const useTrelloStore = createWithEqualityFn<TrelloStore>()(
  devtools(
    (set, get) => ({
      addBoard: (board: TrelloBoard) =>
        set(
          (state) => ({
            boards: [...state.boards, board],
          }),
          false,
          "trello/addBoard",
        ),

      addCard: (card: TrelloCard) =>
        set(
          (state) => ({
            cards: [...state.cards, card],
          }),
          false,
          "trello/addCard",
        ),

      addList: (list: TrelloList) =>
        set(
          (state) => ({
            lists: [...state.lists, list],
          }),
          false,
          "trello/addList",
        ),
      // State
      boards: [],
      cards: [],

      clearError: () => set({ error: null }, false, "trello/clearError"),

      createBoard: async (options: CreateBoardOptions) => {
        const service = initializeApiService();
        storeLogger.debug("Starting board creation", {
          action: "createBoard",
          boardName: options.name,
        });
        storeLogger.time(`createBoard-${options.name}`);

        set(
          (state) => ({ loading: { ...state.loading, creating: true } }),
          false,
          "trello/createBoard/start",
        );

        try {
          const response = await service.createBoard(options);
          storeLogger.debug("Board creation response received", {
            action: "createBoard",
            boardName: options.name,
            hasData: !!response.data,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Board created successfully", {
              action: "createBoard",
              boardId: response.data.id,
              boardName: response.data.name,
              boardUrl: response.data.url,
            });
            set(
              (state) => ({
                boards: [...state.boards, response.data!],
                error: null,
              }),
              false,
              "trello/createBoard/success",
            );
            return response.data;
          }

          const errorMsg = response.error || "Failed to create board";
          storeLogger.error("Failed to create board", {
            action: "createBoard",
            boardName: options.name,
            error: errorMsg,
          });
          set({ error: errorMsg }, false, "trello/createBoard/error");
          return null;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to create board";
          storeLogger.error(
            "Exception during board creation",
            { action: "createBoard", boardName: options.name },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/createBoard/error");
          return null;
        } finally {
          storeLogger.timeEnd(`createBoard-${options.name}`);
          set(
            (state) => ({ loading: { ...state.loading, creating: false } }),
            false,
            "trello/createBoard/end",
          );
        }
      },

      createCard: async (listId: string, options: CreateCardOptions) => {
        const service = initializeApiService();
        storeLogger.debug("Starting card creation", {
          action: "createCard",
          cardName: options.name,
          listId,
          position: options.pos,
        });
        storeLogger.time(`createCard-${options.name}`);

        set(
          (state) => ({ loading: { ...state.loading, creating: true } }),
          false,
          "trello/createCard/start",
        );

        try {
          const response = await service.createCard(listId, options);
          storeLogger.debug("Card creation response received", {
            action: "createCard",
            cardName: options.name,
            hasData: !!response.data,
            hasError: !!response.error,
            listId,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Card created successfully", {
              action: "createCard",
              cardId: response.data.id,
              cardName: response.data.name,
              cardUrl: response.data.url,
              hasDescription: !!response.data.desc,
              listId,
            });
            set(
              (state) => ({
                cards: [...state.cards, response.data!],
                error: null,
              }),
              false,
              "trello/createCard/success",
            );
            return response.data;
          }

          const errorMsg = response.error || "Failed to create card";
          storeLogger.error("Failed to create card", {
            action: "createCard",
            cardName: options.name,
            error: errorMsg,
            listId,
          });
          set({ error: errorMsg }, false, "trello/createCard/error");
          return null;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to create card";
          storeLogger.error(
            "Exception during card creation",
            { action: "createCard", cardName: options.name, listId },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/createCard/error");
          return null;
        } finally {
          storeLogger.timeEnd(`createCard-${options.name}`);
          set(
            (state) => ({ loading: { ...state.loading, creating: false } }),
            false,
            "trello/createCard/end",
          );
        }
      },

      createList: async (boardId: string, name: string, pos?: string | number) => {
        const service = initializeApiService();
        storeLogger.debug("Starting list creation", {
          action: "createList",
          boardId,
          listName: name,
          position: pos,
        });
        storeLogger.time(`createList-${name}`);

        set(
          (state) => ({ loading: { ...state.loading, creating: true } }),
          false,
          "trello/createList/start",
        );

        try {
          const response = await service.createList(boardId, name, pos);
          storeLogger.debug("List creation response received", {
            action: "createList",
            boardId,
            hasData: !!response.data,
            hasError: !!response.error,
            listName: name,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("List created successfully", {
              action: "createList",
              boardId,
              listId: response.data.id,
              listName: response.data.name,
              position: response.data.pos,
            });
            set(
              (state) => ({
                error: null,
                lists: [...state.lists, response.data!],
              }),
              false,
              "trello/createList/success",
            );
            return response.data;
          }

          const errorMsg = response.error || "Failed to create list";
          storeLogger.error("Failed to create list", {
            action: "createList",
            boardId,
            error: errorMsg,
            listName: name,
          });
          set({ error: errorMsg }, false, "trello/createList/error");
          return null;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to create list";
          storeLogger.error(
            "Exception during list creation",
            { action: "createList", boardId, listName: name },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/createList/error");
          return null;
        } finally {
          storeLogger.timeEnd(`createList-${name}`);
          set(
            (state) => ({ loading: { ...state.loading, creating: false } }),
            false,
            "trello/createList/end",
          );
        }
      },
      currentMember: null,

      deleteBoard: async (boardId: string) => {
        const service = initializeApiService();
        const currentState = get();
        const boardToDelete = currentState.boards.find((b) => b.id === boardId);

        storeLogger.debug("Starting board deletion", {
          action: "deleteBoard",
          boardId,
          boardName: boardToDelete?.name,
        });
        storeLogger.time(`deleteBoard-${boardId}`);

        set(
          (state) => ({ loading: { ...state.loading, deleting: true } }),
          false,
          "trello/deleteBoard/start",
        );

        try {
          const response = await service.deleteBoard(boardId);
          storeLogger.debug("Board deletion response received", {
            action: "deleteBoard",
            boardId,
            boardName: boardToDelete?.name,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success) {
            const relatedListsCount = currentState.lists.filter(
              (list) => list.idBoard === boardId,
            ).length;
            const relatedCardsCount = currentState.cards.filter(
              (card) => card.idBoard === boardId,
            ).length;

            storeLogger.info("Board deleted successfully", {
              action: "deleteBoard",
              boardId,
              boardName: boardToDelete?.name,
              relatedCardsRemoved: relatedCardsCount,
              relatedListsRemoved: relatedListsCount,
            });

            set(
              (state) => ({
                boards: state.boards.filter((board) => board.id !== boardId),
                cards: state.cards.filter((card) => card.idBoard !== boardId),
                error: null,
                // Also remove related lists and cards
                lists: state.lists.filter((list) => list.idBoard !== boardId),
                selectedBoard: state.selectedBoard?.id === boardId ? null : state.selectedBoard,
              }),
              false,
              "trello/deleteBoard/success",
            );
            return true;
          }

          const errorMsg = response.error || "Failed to delete board";
          storeLogger.error("Failed to delete board", {
            action: "deleteBoard",
            boardId,
            boardName: boardToDelete?.name,
            error: errorMsg,
          });
          set({ error: errorMsg }, false, "trello/deleteBoard/error");
          return false;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to delete board";
          storeLogger.error(
            "Exception during board deletion",
            { action: "deleteBoard", boardId, boardName: boardToDelete?.name },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/deleteBoard/error");
          return false;
        } finally {
          storeLogger.timeEnd(`deleteBoard-${boardId}`);
          set(
            (state) => ({ loading: { ...state.loading, deleting: false } }),
            false,
            "trello/deleteBoard/end",
          );
        }
      },

      deleteCard: async (cardId: string) => {
        const service = initializeApiService();
        const currentState = get();
        const cardToDelete = currentState.cards.find((c) => c.id === cardId);

        storeLogger.debug("Starting card deletion", {
          action: "deleteCard",
          cardId,
          cardName: cardToDelete?.name,
          listId: cardToDelete?.idList,
        });
        storeLogger.time(`deleteCard-${cardId}`);

        set(
          (state) => ({ loading: { ...state.loading, deleting: true } }),
          false,
          "trello/deleteCard/start",
        );

        try {
          const response = await service.deleteCard(cardId);
          storeLogger.debug("Card deletion response received", {
            action: "deleteCard",
            cardId,
            cardName: cardToDelete?.name,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success) {
            storeLogger.info("Card deleted successfully", {
              action: "deleteCard",
              boardId: cardToDelete?.idBoard,
              cardId,
              cardName: cardToDelete?.name,
              listId: cardToDelete?.idList,
            });

            set(
              (state) => ({
                cards: state.cards.filter((card) => card.id !== cardId),
                error: null,
                selectedCard: state.selectedCard?.id === cardId ? null : state.selectedCard,
              }),
              false,
              "trello/deleteCard/success",
            );
            return true;
          }

          const errorMsg = response.error || "Failed to delete card";
          storeLogger.error("Failed to delete card", {
            action: "deleteCard",
            cardId,
            cardName: cardToDelete?.name,
            error: errorMsg,
          });
          set({ error: errorMsg }, false, "trello/deleteCard/error");
          return false;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to delete card";
          storeLogger.error(
            "Exception during card deletion",
            { action: "deleteCard", cardId, cardName: cardToDelete?.name },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/deleteCard/error");
          return false;
        } finally {
          storeLogger.timeEnd(`deleteCard-${cardId}`);
          set(
            (state) => ({ loading: { ...state.loading, deleting: false } }),
            false,
            "trello/deleteCard/end",
          );
        }
      },
      error: null,

      fetchBoard: async (boardId: string) => {
        const service = initializeApiService();
        storeLogger.debug("Starting single board fetch", { action: "fetchBoard", boardId });
        storeLogger.time(`fetchBoard-${boardId}`);

        try {
          const response = await service.getBoard(boardId);
          storeLogger.debug("Board fetch response received", {
            action: "fetchBoard",
            boardId,
            hasData: !!response.data,
            hasError: !!response.error,
            success: response.success,
          });
          return applyFetchedBoard(set, boardId, response);
        } catch (error) {
          const errorMsg = caughtMessage(error, "Failed to fetch board");
          logStoreException(
            "Exception during board fetch",
            { action: "fetchBoard", boardId },
            error,
          );
          set({ error: errorMsg }, false, "trello/fetchBoard/error");
          return null;
        } finally {
          storeLogger.timeEnd(`fetchBoard-${boardId}`);
        }
      },

      fetchBoardCards: async (boardId: string) => {
        const service = initializeApiService();
        storeLogger.debug("Starting board cards fetch", { action: "fetchBoardCards", boardId });
        storeLogger.time(`fetchBoardCards-${boardId}`);

        set(
          (state) => ({ loading: { ...state.loading, cards: true } }),
          false,
          "trello/fetchBoardCards/start",
        );

        try {
          const response = await service.getCardsOnBoard(boardId);
          storeLogger.debug("Board cards fetch response received", {
            action: "fetchBoardCards",
            boardId,
            dataLength: response.data?.length,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Board cards fetched successfully", {
              action: "fetchBoardCards",
              boardId,
              cardCount: response.data.length,
              cardNames: response.data.map((c) => c.name).slice(0, 10), // Limit to first 10 for logging
            });
            set({ cards: response.data, error: null }, false, "trello/fetchBoardCards/success");
          } else {
            const errorMsg = response.error || "Failed to fetch board cards";
            storeLogger.error("Failed to fetch board cards", {
              action: "fetchBoardCards",
              boardId,
              error: errorMsg,
            });
            set({ error: errorMsg }, false, "trello/fetchBoardCards/error");
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to fetch board cards";
          storeLogger.error(
            "Exception during board cards fetch",
            { action: "fetchBoardCards", boardId },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/fetchBoardCards/error");
        } finally {
          storeLogger.timeEnd(`fetchBoardCards-${boardId}`);
          set(
            (state) => ({ loading: { ...state.loading, cards: false } }),
            false,
            "trello/fetchBoardCards/end",
          );
        }
      },

      fetchBoardLists: async (boardId: string) => {
        const service = initializeApiService();
        storeLogger.debug("Starting board lists fetch", { action: "fetchBoardLists", boardId });
        storeLogger.time(`fetchBoardLists-${boardId}`);

        set(
          (state) => ({ loading: { ...state.loading, lists: true } }),
          false,
          "trello/fetchBoardLists/start",
        );

        try {
          const response = await service.getListsOnBoard(boardId);
          storeLogger.debug("Board lists fetch response received", {
            action: "fetchBoardLists",
            boardId,
            dataLength: response.data?.length,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Board lists fetched successfully", {
              action: "fetchBoardLists",
              boardId,
              listCount: response.data.length,
              listNames: response.data.map((l) => l.name),
            });
            set({ error: null, lists: response.data }, false, "trello/fetchBoardLists/success");
          } else {
            const errorMsg = response.error || "Failed to fetch board lists";
            storeLogger.error("Failed to fetch board lists", {
              action: "fetchBoardLists",
              boardId,
              error: errorMsg,
            });
            set({ error: errorMsg }, false, "trello/fetchBoardLists/error");
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to fetch board lists";
          storeLogger.error(
            "Exception during board lists fetch",
            { action: "fetchBoardLists", boardId },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/fetchBoardLists/error");
        } finally {
          storeLogger.timeEnd(`fetchBoardLists-${boardId}`);
          set(
            (state) => ({ loading: { ...state.loading, lists: false } }),
            false,
            "trello/fetchBoardLists/end",
          );
        }
      },

      // API Actions
      fetchBoards: async () => {
        const service = initializeApiService();
        storeLogger.debug("Starting boards fetch", { action: "fetchBoards" });
        storeLogger.time("fetchBoards");

        set(
          (state) => ({ loading: { ...state.loading, boards: true } }),
          false,
          "trello/fetchBoards/start",
        );

        try {
          const response = await service.getBoards();
          storeLogger.debug("Boards fetch response received", {
            action: "fetchBoards",
            dataLength: response.data?.length,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Boards fetched successfully", {
              action: "fetchBoards",
              boardCount: response.data.length,
              boardNames: response.data.map((b) => b.name),
            });
            set({ boards: response.data, error: null }, false, "trello/fetchBoards/success");
          } else {
            const errorMsg = response.error || "Failed to fetch boards";
            storeLogger.error("Failed to fetch boards", { action: "fetchBoards", error: errorMsg });
            set({ error: errorMsg }, false, "trello/fetchBoards/error");
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to fetch boards";
          storeLogger.error(
            "Exception during boards fetch",
            { action: "fetchBoards" },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/fetchBoards/error");
        } finally {
          storeLogger.timeEnd("fetchBoards");
          set(
            (state) => ({ loading: { ...state.loading, boards: false } }),
            false,
            "trello/fetchBoards/end",
          );
        }
      },

      fetchCurrentMember: async () => {
        const service = initializeApiService();
        storeLogger.debug("Starting current member fetch", { action: "fetchCurrentMember" });
        storeLogger.time("fetchCurrentMember");

        set(
          (state) => ({ loading: { ...state.loading, currentMember: true } }),
          false,
          "trello/fetchCurrentMember/start",
        );

        try {
          const response = await service.getCurrentMember();
          storeLogger.debug("Current member fetch response received", {
            action: "fetchCurrentMember",
            hasData: !!response.data,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Current member fetched successfully", {
              action: "fetchCurrentMember",
              memberFullName: response.data.fullName,
              memberId: response.data.id,
              memberUsername: response.data.username,
            });
            set(
              { currentMember: response.data, error: null },
              false,
              "trello/fetchCurrentMember/success",
            );
          } else {
            const errorMsg = response.error || "Failed to fetch current member";
            storeLogger.error("Failed to fetch current member", {
              action: "fetchCurrentMember",
              error: errorMsg,
            });
            set({ error: errorMsg }, false, "trello/fetchCurrentMember/error");
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to fetch current member";
          storeLogger.error(
            "Exception during current member fetch",
            { action: "fetchCurrentMember" },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/fetchCurrentMember/error");
        } finally {
          storeLogger.timeEnd("fetchCurrentMember");
          set(
            (state) => ({ loading: { ...state.loading, currentMember: false } }),
            false,
            "trello/fetchCurrentMember/end",
          );
        }
      },

      fetchMemberBoards: async (memberId?: string) => {
        const service = initializeApiService();
        storeLogger.debug("Starting member boards fetch", {
          action: "fetchMemberBoards",
          memberId: memberId || "current",
        });
        storeLogger.time(`fetchMemberBoards-${memberId || "current"}`);

        set(
          (state) => ({ loading: { ...state.loading, boards: true } }),
          false,
          "trello/fetchMemberBoards/start",
        );

        try {
          const response = await service.getMemberBoards(memberId);
          storeLogger.debug("Member boards fetch response received", {
            action: "fetchMemberBoards",
            dataLength: response.data?.length,
            hasError: !!response.error,
            memberId: memberId || "current",
            success: response.success,
          });
          applyMemberBoards(set, memberId, response);
        } catch (error) {
          const errorMsg = caughtMessage(error, "Failed to fetch member boards");
          logStoreException(
            "Exception during member boards fetch",
            { action: "fetchMemberBoards", memberId: memberId || "current" },
            error,
          );
          set({ error: errorMsg }, false, "trello/fetchMemberBoards/error");
        } finally {
          storeLogger.timeEnd(`fetchMemberBoards-${memberId || "current"}`);
          set(
            (state) => ({ loading: { ...state.loading, boards: false } }),
            false,
            "trello/fetchMemberBoards/end",
          );
        }
      },

      getArticleMetadata: async (cardId: string, boardId: string) => {
        const service = initializeApiService();
        storeLogger.debug("Starting article metadata extraction", {
          action: "getArticleMetadata",
          boardId,
          cardId,
        });
        storeLogger.time(`getArticleMetadata-${cardId}`);

        try {
          // Get board custom fields to map IDs to names
          const boardFieldsResponse = await service.getBoardCustomFields(boardId);
          if (!boardFieldsResponse.success || !boardFieldsResponse.data) {
            return null;
          }

          const fieldNameMap = new Map<string, string>();
          boardFieldsResponse.data.forEach((field: any) => {
            fieldNameMap.set(field.id, field.name);
          });

          // Get card custom field values
          const cardFieldsResponse = await service.getCardCustomFields(cardId);
          if (!cardFieldsResponse.success || !cardFieldsResponse.data) {
            return null;
          }

          const metadata: any = {};
          cardFieldsResponse.data.forEach((fieldItem: any) => {
            const fieldName = fieldNameMap.get(fieldItem.idCustomField);
            const value = fieldItem.value?.text || fieldItem.value?.number || fieldItem.value?.date;

            if (!fieldName || !value) return;

            switch (fieldName) {
              case "Article ID":
                metadata.articleId = value;
                break;
              case "Article Link":
                metadata.articleLink = value;
                break;
              case "Article Title":
                metadata.articleTitle = value;
                break;
              case "Converted From":
                metadata.convertedFrom = value;
                break;
              case "Converted Date":
                metadata.convertedDate = value;
                break;
            }
          });

          const hasArticleData = Object.keys(metadata).length > 0;

          storeLogger.info("Article metadata extraction completed", {
            action: "getArticleMetadata",
            boardId,
            cardId,
            fieldCount: Object.keys(metadata).length,
            hasMetadata: hasArticleData,
          });

          return hasArticleData ? metadata : null;
        } catch (error) {
          storeLogger.error(
            "Exception during article metadata extraction",
            { action: "getArticleMetadata", boardId, cardId },
            undefined,
            error instanceof Error ? error : undefined,
          );
          return null;
        } finally {
          storeLogger.timeEnd(`getArticleMetadata-${cardId}`);
        }
      },

      // Custom Fields Actions
      getBoardCustomFields: async (boardId: string) => {
        const service = initializeApiService();
        storeLogger.debug("Starting board custom fields fetch", {
          action: "getBoardCustomFields",
          boardId,
        });
        storeLogger.time(`getBoardCustomFields-${boardId}`);

        try {
          const response = await service.getBoardCustomFields(boardId);
          storeLogger.debug("Board custom fields fetch response received", {
            action: "getBoardCustomFields",
            boardId,
            dataLength: response.data?.length,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Board custom fields fetched successfully", {
              action: "getBoardCustomFields",
              boardId,
              fieldsCount: response.data.length,
            });
            return response.data;
          }

          const errorMsg = response.error || "Failed to fetch board custom fields";
          storeLogger.error("Failed to fetch board custom fields", {
            action: "getBoardCustomFields",
            boardId,
            error: errorMsg,
          });
          set({ error: errorMsg }, false, "trello/getBoardCustomFields/error");
          return [];
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to fetch board custom fields";
          storeLogger.error(
            "Exception during board custom fields fetch",
            { action: "getBoardCustomFields", boardId },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/getBoardCustomFields/error");
          return [];
        } finally {
          storeLogger.timeEnd(`getBoardCustomFields-${boardId}`);
        }
      },

      healthCheck: async () => {
        const service = initializeApiService();
        storeLogger.debug("Starting Trello API health check", { action: "healthCheck" });
        storeLogger.time("healthCheck");

        try {
          const result = await service.healthCheck();
          storeLogger.debug("Health check completed", { action: "healthCheck", healthy: result });

          if (result) {
            storeLogger.info("Trello API health check passed", { action: "healthCheck" });
          } else {
            storeLogger.warn("Trello API health check failed", { action: "healthCheck" });
          }

          return result;
        } catch (error) {
          storeLogger.error(
            "Exception during health check",
            { action: "healthCheck" },
            undefined,
            error instanceof Error ? error : undefined,
          );
          return false;
        } finally {
          storeLogger.timeEnd("healthCheck");
        }
      },
      lists: [],
      loading: {
        boards: false,
        cards: false,
        creating: false,
        currentMember: false,
        deleting: false,
        lists: false,
        members: false,
        updating: false,
      },
      members: [],

      moveCard: async (cardId: string, listId: string, position?: number | "top" | "bottom") => {
        const service = initializeApiService();
        const currentState = get();
        const cardToMove = currentState.cards.find((c) => c.id === cardId);
        const targetList = currentState.lists.find((l) => l.id === listId);

        storeLogger.debug("Starting card move", {
          action: "moveCard",
          cardId,
          cardName: cardToMove?.name,
          fromListId: cardToMove?.idList,
          position,
          targetListName: targetList?.name,
          toListId: listId,
        });
        storeLogger.time(`moveCard-${cardId}`);

        set(
          (state) => ({ loading: { ...state.loading, updating: true } }),
          false,
          "trello/moveCard/start",
        );

        try {
          const response = await service.moveCard(cardId, listId, position);
          storeLogger.debug("Card move response received", {
            action: "moveCard",
            cardId,
            cardName: cardToMove?.name,
            hasData: !!response.data,
            hasError: !!response.error,
            success: response.success,
          });

          if (response.success && response.data) {
            storeLogger.info("Card moved successfully", {
              action: "moveCard",
              cardId,
              cardName: response.data.name,
              fromListId: cardToMove?.idList,
              newPosition: response.data.pos,
              toListId: response.data.idList,
            });

            set(
              (state) => ({
                cards: state.cards.map((card) => (card.id === cardId ? response.data! : card)),
                error: null,
                selectedCard:
                  state.selectedCard?.id === cardId ? response.data! : state.selectedCard,
              }),
              false,
              "trello/moveCard/success",
            );
            return response.data;
          }

          const errorMsg = response.error || "Failed to move card";
          storeLogger.error("Failed to move card", {
            action: "moveCard",
            cardId,
            cardName: cardToMove?.name,
            error: errorMsg,
          });
          set({ error: errorMsg }, false, "trello/moveCard/error");
          return null;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to move card";
          storeLogger.error(
            "Exception during card move",
            { action: "moveCard", cardId, cardName: cardToMove?.name },
            undefined,
            error instanceof Error ? error : undefined,
          );
          set({ error: errorMsg }, false, "trello/moveCard/error");
          return null;
        } finally {
          storeLogger.timeEnd(`moveCard-${cardId}`);
          set(
            (state) => ({ loading: { ...state.loading, updating: false } }),
            false,
            "trello/moveCard/end",
          );
        }
      },

      removeBoard: (boardId: string) =>
        set(
          (state) => ({
            boards: state.boards.filter((board) => board.id !== boardId),
            cards: state.cards.filter((card) => card.idBoard !== boardId),
            // Also remove related lists and cards
            lists: state.lists.filter((list) => list.idBoard !== boardId),
            selectedBoard: state.selectedBoard?.id === boardId ? null : state.selectedBoard,
          }),
          false,
          "trello/removeBoard",
        ),

      removeCard: (cardId: string) =>
        set(
          (state) => ({
            cards: state.cards.filter((card) => card.id !== cardId),
            selectedCard: state.selectedCard?.id === cardId ? null : state.selectedCard,
          }),
          false,
          "trello/removeCard",
        ),

      removeList: (listId: string) =>
        set(
          (state) => ({
            // Also remove cards in this list
            cards: state.cards.filter((card) => card.idList !== listId),
            lists: state.lists.filter((list) => list.id !== listId),
            selectedList: state.selectedList?.id === listId ? null : state.selectedList,
          }),
          false,
          "trello/removeList",
        ),
      selectedBoard: null,
      selectedCard: null,
      selectedList: null,

      setArticleMetadata: async (cardId: string, boardId: string, articleData: any) => {
        const service = initializeApiService();
        storeLogger.debug("Starting article metadata setup", {
          action: "setArticleMetadata",
          boardId,
          cardId,
          hasArticleId: !!articleData.articleId,
        });
        storeLogger.time(`setArticleMetadata-${cardId}`);

        try {
          const existingFields = await service.getBoardCustomFields(boardId);
          if (!existingFields.success || !existingFields.data) {
            throw new Error("Failed to get board custom fields");
          }

          const fieldMap = new Map<string, { id: string }>();
          existingFields.data.forEach((field: { id: string; name: string }) => {
            fieldMap.set(field.name, field);
          });
          await ensureArticleFields(service, boardId, fieldMap);
          collectArticleFields(articleData, fieldMap);

          storeLogger.warn("No custom fields to set", {
            action: "setArticleMetadata",
            boardId,
            cardId,
          });
          return false;
        } catch (error) {
          const errorMsg = caughtMessage(error, "Failed to set article metadata");
          logStoreException(
            "Exception during article metadata setup",
            { action: "setArticleMetadata", boardId, cardId },
            error,
          );
          set({ error: errorMsg }, false, "trello/setArticleMetadata/error");
          return false;
        } finally {
          storeLogger.timeEnd(`setArticleMetadata-${cardId}`);
        }
      },

      // Basic State Actions
      setBoards: (boards: TrelloBoard[]) => set({ boards }, false, "trello/setBoards"),

      setCards: (cards: TrelloCard[]) => set({ cards }, false, "trello/setCards"),

      setCurrentMember: (currentMember: TrelloMember | null) =>
        set({ currentMember }, false, "trello/setCurrentMember"),

      setLists: (lists: TrelloList[]) => set({ lists }, false, "trello/setLists"),

      setLoading: (key: keyof TrelloLoadingState, loading: boolean) =>
        set(
          (state) => ({
            loading: { ...state.loading, [key]: loading },
          }),
          false,
          `trello/setLoading/${key}`,
        ),

      setMembers: (members: TrelloMember[]) => set({ members }, false, "trello/setMembers"),

      setSelectedBoard: (board: TrelloBoard | null) =>
        set({ selectedBoard: board }, false, "trello/setSelectedBoard"),

      setSelectedCard: (card: TrelloCard | null) =>
        set({ selectedCard: card }, false, "trello/setSelectedCard"),

      setSelectedList: (list: TrelloList | null) =>
        set({ selectedList: list }, false, "trello/setSelectedList"),

      showError: (error: string | null) => set({ error }, false, "trello/showError"),

      updateBoard: (boardId: string, updates: Partial<TrelloBoard>) =>
        set(
          (state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId ? { ...board, ...updates } : board,
            ),
            selectedBoard:
              state.selectedBoard?.id === boardId
                ? { ...state.selectedBoard, ...updates }
                : state.selectedBoard,
          }),
          false,
          "trello/updateBoard",
        ),

      updateBoardApi: async (boardId: string, updates: Partial<TrelloBoard>) => {
        set(
          (state) => ({ loading: { ...state.loading, updating: true } }),
          false,
          "trello/updateBoard/start",
        );

        try {
          // For now, just update locally since we don't have an update board endpoint
          set(
            (state) => ({
              boards: state.boards.map((board) =>
                board.id === boardId ? { ...board, ...updates } : board,
              ),
              error: null,
              selectedBoard:
                state.selectedBoard?.id === boardId
                  ? { ...state.selectedBoard, ...updates }
                  : state.selectedBoard,
            }),
            false,
            "trello/updateBoard/success",
          );
          return get().boards.find((b) => b.id === boardId) || null;
        } catch (error) {
          set(
            { error: error instanceof Error ? error.message : "Failed to update board" },
            false,
            "trello/updateBoard/error",
          );
          return null;
        } finally {
          set(
            (state) => ({ loading: { ...state.loading, updating: false } }),
            false,
            "trello/updateBoard/end",
          );
        }
      },

      updateCard: (cardId: string, updates: Partial<TrelloCard>) =>
        set(
          (state) => ({
            cards: state.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)),
            selectedCard:
              state.selectedCard?.id === cardId
                ? { ...state.selectedCard, ...updates }
                : state.selectedCard,
          }),
          false,
          "trello/updateCard",
        ),

      updateCardApi: async (cardId: string, options: UpdateCardOptions) => {
        const service = initializeApiService();
        set(
          (state) => ({ loading: { ...state.loading, updating: true } }),
          false,
          "trello/updateCard/start",
        );

        try {
          const response = await service.updateCard(cardId, options);
          if (response.success && response.data) {
            set(
              (state) => ({
                cards: state.cards.map((card) => (card.id === cardId ? response.data! : card)),
                error: null,
                selectedCard:
                  state.selectedCard?.id === cardId ? response.data! : state.selectedCard,
              }),
              false,
              "trello/updateCard/success",
            );
            return response.data;
          }
          set(
            { error: response.error || "Failed to update card" },
            false,
            "trello/updateCard/error",
          );
          return null;
        } catch (error) {
          set(
            { error: error instanceof Error ? error.message : "Failed to update card" },
            false,
            "trello/updateCard/error",
          );
          return null;
        } finally {
          set(
            (state) => ({ loading: { ...state.loading, updating: false } }),
            false,
            "trello/updateCard/end",
          );
        }
      },

      updateList: (listId: string, updates: Partial<TrelloList>) =>
        set(
          (state) => ({
            lists: state.lists.map((list) => (list.id === listId ? { ...list, ...updates } : list)),
            selectedList:
              state.selectedList?.id === listId
                ? { ...state.selectedList, ...updates }
                : state.selectedList,
          }),
          false,
          "trello/updateList",
        ),

      updateListApi: async (listId: string, updates: Partial<TrelloList>) => {
        const service = initializeApiService();
        set(
          (state) => ({ loading: { ...state.loading, updating: true } }),
          false,
          "trello/updateList/start",
        );

        try {
          const response = await service.updateList(listId, updates);
          if (response.success && response.data) {
            set(
              (state) => ({
                error: null,
                lists: state.lists.map((list) => (list.id === listId ? response.data! : list)),
                selectedList:
                  state.selectedList?.id === listId ? response.data! : state.selectedList,
              }),
              false,
              "trello/updateList/success",
            );
            return response.data;
          }
          set(
            { error: response.error || "Failed to update list" },
            false,
            "trello/updateList/error",
          );
          return null;
        } catch (error) {
          set(
            { error: error instanceof Error ? error.message : "Failed to update list" },
            false,
            "trello/updateList/error",
          );
          return null;
        } finally {
          set(
            (state) => ({ loading: { ...state.loading, updating: false } }),
            false,
            "trello/updateList/end",
          );
        }
      },
    }),
    {
      name: "trello-store",
    },
  ),
  shallow,
);

// Selectors following Zustand best practices
export const trelloSelectors = {
  // Computed selectors
  boardById: (boardId: string) => (state: TrelloStore) =>
    state.boards.find((board) => board.id === boardId),
  // Basic selectors
  boards: (state: TrelloStore) => state.boards,

  // Count selectors
  boardsCount: (state: TrelloStore) => state.boards.length,

  cardById: (cardId: string) => (state: TrelloStore) =>
    state.cards.find((card) => card.id === cardId),
  cards: (state: TrelloStore) => state.cards,

  cardsByBoard: (boardId: string) => (state: TrelloStore) =>
    state.cards.filter((card) => card.idBoard === boardId),

  cardsByList: (listId: string) => (state: TrelloStore) =>
    state.cards.filter((card) => card.idList === listId),
  cardsCount: (state: TrelloStore) => state.cards.length,

  cardsCountForBoard: (boardId: string) => (state: TrelloStore) =>
    state.cards.filter((card) => card.idBoard === boardId).length,

  cardsCountForList: (listId: string) => (state: TrelloStore) =>
    state.cards.filter((card) => card.idList === listId).length,
  currentMember: (state: TrelloStore) => state.currentMember,
  error: (state: TrelloStore) => state.error,
  hasBoards: (state: TrelloStore) => state.boards.length > 0,
  hasCards: (state: TrelloStore) => state.cards.length > 0,
  hasCurrentMember: (state: TrelloStore) => state.currentMember !== null,

  // Status selectors
  hasError: (state: TrelloStore) => state.error !== null,
  hasLists: (state: TrelloStore) => state.lists.length > 0,
  hasMembers: (state: TrelloStore) => state.members.length > 0,
  isAnyLoading: (state: TrelloStore) => Object.values(state.loading).some(Boolean),
  isCreating: (state: TrelloStore) => state.loading.creating,
  isDeleting: (state: TrelloStore) => state.loading.deleting,

  // Loading selectors
  isLoadingBoards: (state: TrelloStore) => state.loading.boards,
  isLoadingCards: (state: TrelloStore) => state.loading.cards,
  isLoadingCurrentMember: (state: TrelloStore) => state.loading.currentMember,
  isLoadingLists: (state: TrelloStore) => state.loading.lists,
  isLoadingMembers: (state: TrelloStore) => state.loading.members,
  isUpdating: (state: TrelloStore) => state.loading.updating,

  listById: (listId: string) => (state: TrelloStore) =>
    state.lists.find((list) => list.id === listId),
  lists: (state: TrelloStore) => state.lists,

  listsByBoard: (boardId: string) => (state: TrelloStore) =>
    state.lists.filter((list) => list.idBoard === boardId),
  listsCount: (state: TrelloStore) => state.lists.length,

  listsCountForBoard: (boardId: string) => (state: TrelloStore) =>
    state.lists.filter((list) => list.idBoard === boardId).length,
  loading: (state: TrelloStore) => state.loading,
  members: (state: TrelloStore) => state.members,
  membersCount: (state: TrelloStore) => state.members.length,
  selectedBoard: (state: TrelloStore) => state.selectedBoard,
  selectedCard: (state: TrelloStore) => state.selectedCard,
  selectedList: (state: TrelloStore) => state.selectedList,
};

// Actions for external use
export const trelloActions = {
  addBoard: (board: TrelloBoard) => useTrelloStore.getState().addBoard(board),
  addCard: (card: TrelloCard) => useTrelloStore.getState().addCard(card),
  addList: (list: TrelloList) => useTrelloStore.getState().addList(list),
  clearError: () => useTrelloStore.getState().clearError(),

  createBoard: (options: CreateBoardOptions) => useTrelloStore.getState().createBoard(options),
  createCard: (listId: string, options: CreateCardOptions) =>
    useTrelloStore.getState().createCard(listId, options),
  createList: (boardId: string, name: string, pos?: string | number) =>
    useTrelloStore.getState().createList(boardId, name, pos),

  deleteBoard: (boardId: string) => useTrelloStore.getState().deleteBoard(boardId),
  deleteCard: (cardId: string) => useTrelloStore.getState().deleteCard(cardId),
  fetchBoard: (boardId: string) => useTrelloStore.getState().fetchBoard(boardId),
  fetchBoardCards: (boardId: string) => useTrelloStore.getState().fetchBoardCards(boardId),
  fetchBoardLists: (boardId: string) => useTrelloStore.getState().fetchBoardLists(boardId),

  // API actions
  fetchBoards: () => useTrelloStore.getState().fetchBoards(),
  fetchCurrentMember: () => useTrelloStore.getState().fetchCurrentMember(),
  fetchMemberBoards: (memberId?: string) => useTrelloStore.getState().fetchMemberBoards(memberId),
  getArticleMetadata: (cardId: string, boardId: string) =>
    useTrelloStore.getState().getArticleMetadata(cardId, boardId),

  // Custom Fields actions
  getBoardCustomFields: (boardId: string) =>
    useTrelloStore.getState().getBoardCustomFields(boardId),

  healthCheck: () => useTrelloStore.getState().healthCheck(),
  moveCard: (cardId: string, listId: string, position?: number | "top" | "bottom") =>
    useTrelloStore.getState().moveCard(cardId, listId, position),

  removeBoard: (boardId: string) => useTrelloStore.getState().removeBoard(boardId),
  removeCard: (cardId: string) => useTrelloStore.getState().removeCard(cardId),
  removeList: (listId: string) => useTrelloStore.getState().removeList(listId),
  setArticleMetadata: (cardId: string, boardId: string, articleData: any) =>
    useTrelloStore.getState().setArticleMetadata(cardId, boardId, articleData),
  // Basic state actions
  setBoards: (boards: TrelloBoard[]) => useTrelloStore.getState().setBoards(boards),
  setCards: (cards: TrelloCard[]) => useTrelloStore.getState().setCards(cards),
  setCurrentMember: (member: TrelloMember | null) =>
    useTrelloStore.getState().setCurrentMember(member),
  setLists: (lists: TrelloList[]) => useTrelloStore.getState().setLists(lists),

  setLoading: (key: keyof TrelloLoadingState, loading: boolean) =>
    useTrelloStore.getState().setLoading(key, loading),
  setMembers: (members: TrelloMember[]) => useTrelloStore.getState().setMembers(members),

  setSelectedBoard: (board: TrelloBoard | null) =>
    useTrelloStore.getState().setSelectedBoard(board),
  setSelectedCard: (card: TrelloCard | null) => useTrelloStore.getState().setSelectedCard(card),
  setSelectedList: (list: TrelloList | null) => useTrelloStore.getState().setSelectedList(list),
  showError: (error: string | null) => useTrelloStore.getState().showError(error),

  updateBoard: (boardId: string, updates: Partial<TrelloBoard>) =>
    useTrelloStore.getState().updateBoard(boardId, updates),

  updateBoardApi: (boardId: string, updates: Partial<TrelloBoard>) =>
    useTrelloStore.getState().updateBoardApi(boardId, updates),
  updateCard: (cardId: string, updates: Partial<TrelloCard>) =>
    useTrelloStore.getState().updateCard(cardId, updates),
  updateCardApi: (cardId: string, options: UpdateCardOptions) =>
    useTrelloStore.getState().updateCardApi(cardId, options),
  updateList: (listId: string, updates: Partial<TrelloList>) =>
    useTrelloStore.getState().updateList(listId, updates),
  updateListApi: (listId: string, updates: Partial<TrelloList>) =>
    useTrelloStore.getState().updateListApi(listId, updates),
};
