"use client";

import { useEffect, useState } from "react";

import { logger } from "@shared/utils/client-logger";

import { trelloActions } from "../stores/trelloStore";

/**
 * Hook to check if the Trello store is ready for use
 * This ensures that all store actions are available before components try to use them
 */
export const useTrelloStoreReady = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, showError] = useState<string | null>(null);

  useEffect(() => {
    const checkStoreReady = () => {
      try {
        // Check if basic store actions are available
        if (
          typeof trelloActions === "object" &&
          trelloActions !== null &&
          typeof trelloActions.healthCheck === "function" &&
          typeof trelloActions.fetchBoards === "function" &&
          typeof trelloActions.showError === "function"
        ) {
          setIsReady(true);
          showError(null);
        } else {
          throw new Error("Store actions not properly initialized");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown store initialization error";
        logger("useTrelloStoreReady").error("Trello store not ready:", { errorMessage });
        showError(errorMessage);
        setIsReady(false);
      }
    };

    // Check immediately
    checkStoreReady();

    // Also check after a short delay in case store is still initializing
    const timeout = setTimeout(checkStoreReady, 100);

    return () => clearTimeout(timeout);
  }, []);

  return { error, isReady };
};
