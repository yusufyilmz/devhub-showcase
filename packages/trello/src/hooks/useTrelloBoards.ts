import { useCallback, useEffect } from "react";

import { shallow } from "zustand/shallow";

import { useNotification } from "@shared/runtime/notifications";

import type { BoardService } from "../services/BoardService";
import { trelloActions, trelloSelectors, useTrelloStore } from "../stores/trelloStore";
import type {
  CreateBoardOptions,
  TrelloBoard,
  UseTrelloBoardsOptions,
  UseTrelloBoardsReturn,
} from "../types";

function notifyWhen(enabled: boolean, notify: (message: string) => void, message: string) {
  if (enabled) notify(message);
}

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function reportBoardError(
  showErrorNotification: boolean,
  showError: (message: string) => void,
  message: string,
  onError: ((error: Error) => void) | undefined,
  cause: unknown,
  errorMsg: string,
) {
  notifyWhen(showErrorNotification, showError, message);
  if (!onError) return;
  if (cause instanceof Error) {
    onError(cause);
    return;
  }
  onError(new Error(errorMsg));
}

export const useTrelloBoards = (
  trelloService: BoardService,
  options: UseTrelloBoardsOptions = {},
): UseTrelloBoardsReturn => {
  const {
    autoFetch = true,
    refreshInterval,
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage = "Boards loaded successfully",
    errorMessage = "Failed to load boards",
    onSuccess,
    onError,
  } = options;

  const { showSuccess, showError } = useNotification();

  // Use consolidated selectors with shallow comparison
  const { boards, loading, error } = useTrelloStore(
    (state) => ({
      boards: trelloSelectors.boards(state),
      error: trelloSelectors.error(state),
      loading: trelloSelectors.loading(state),
    }),
    shallow,
  );

  const refetch = useCallback(async () => {
    trelloActions.setLoading("boards", true);
    trelloActions.clearError();

    try {
      const response = await trelloService.getBoards();

      if (response.success && response.data) {
        trelloActions.setBoards(response.data);
        notifyWhen(showSuccessNotification, showSuccess, successMessage);
        onSuccess?.(response.data);
        return;
      }

      const errorMsg = response.error || "Failed to fetch boards";
      trelloActions.showError(errorMsg);
      reportBoardError(
        showErrorNotification,
        showError,
        `${errorMessage}: ${errorMsg}`,
        onError,
        new Error(errorMsg),
        errorMsg,
      );
    } catch (error) {
      const errorMsg = toErrorMessage(error, "Unknown error");
      trelloActions.showError(errorMsg);
      reportBoardError(
        showErrorNotification,
        showError,
        `${errorMessage}: ${errorMsg}`,
        onError,
        error,
        errorMsg,
      );
    } finally {
      trelloActions.setLoading("boards", false);
    }
  }, [
    trelloService,
    showSuccessNotification,
    showErrorNotification,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    showSuccess,
    showError,
  ]);

  const createBoard = useCallback(
    async (name: string, description?: string): Promise<TrelloBoard | null> => {
      trelloActions.setLoading("creating", true);
      trelloActions.clearError();

      try {
        const options: CreateBoardOptions = {
          defaultLabels: true,
          defaultLists: true,
          desc: description,
          name,
          prefs_permissionLevel: "private",
        };

        const response = await trelloService.createBoard(options);

        if (response.success && response.data) {
          trelloActions.addBoard(response.data);
          notifyWhen(showSuccessNotification, showSuccess, `Board "${name}" created successfully`);
          return response.data;
        }

        const errorMsg = response.error || "Failed to create board";
        trelloActions.showError(errorMsg);
        notifyWhen(showErrorNotification, showError, `Failed to create board: ${errorMsg}`);
        return null;
      } catch (error) {
        const errorMsg = toErrorMessage(error, "Unknown error");
        trelloActions.showError(errorMsg);
        notifyWhen(showErrorNotification, showError, `Failed to create board: ${errorMsg}`);
        return null;
      } finally {
        trelloActions.setLoading("creating", false);
      }
    },
    [trelloService, showSuccessNotification, showErrorNotification, showSuccess, showError],
  );

  const deleteBoard = useCallback(
    async (boardId: string): Promise<boolean> => {
      trelloActions.setLoading("deleting", true);
      trelloActions.clearError();

      try {
        const response = await trelloService.deleteBoard(boardId);

        if (response.success) {
          trelloActions.removeBoard(boardId);
          notifyWhen(showSuccessNotification, showSuccess, "Board deleted successfully");
          return true;
        }

        const errorMsg = response.error || "Failed to delete board";
        trelloActions.showError(errorMsg);
        notifyWhen(showErrorNotification, showError, `Failed to delete board: ${errorMsg}`);
        return false;
      } catch (error) {
        const errorMsg = toErrorMessage(error, "Unknown error");
        trelloActions.showError(errorMsg);
        notifyWhen(showErrorNotification, showError, `Failed to delete board: ${errorMsg}`);
        return false;
      } finally {
        trelloActions.setLoading("deleting", false);
      }
    },
    [trelloService, showSuccessNotification, showErrorNotification, showSuccess, showError],
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(refetch, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, refetch]);

  return {
    boards,
    createBoard,
    deleteBoard,
    error,
    loading: loading.boards,
    refetch,
  };
};
