import { useCallback, useEffect, useRef } from "react";

import {
  type DebouncedFetchProps,
  type DebouncedFetchReturn,
  useDebouncedFetch,
} from "../debounced/useDebouncedFetch";
import { useNotification } from "../notifications/useNotification";

// TODO: move to base/useFetch.ts
interface ApiRequestOptions {
  errorMessage?: string;
  onError?: (error: Error) => void;
  onSuccess?: Array<(data: any) => void>;
  showErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  successMessage?: string;
}

export interface UseDebouncedApiRequestProps
  extends Omit<DebouncedFetchProps, "start">,
    ApiRequestOptions {
  debounceMs?: number;
  start?: boolean;
}

export interface UseDebouncedApiRequestReturn<ResponseType, RequestParams = object>
  extends DebouncedFetchReturn<ResponseType, RequestParams> {
  cancel: () => void;
  execute: (params: RequestParams) => Promise<void> | void;
}

/**
 * Enhanced debounced fetch hook with automatic error/success notifications
 * and additional callback options
 */
export const useDebouncedApiRequest = <ResponseType = unknown, RequestParams = object>({
  debounceMs = 500,
  showSuccessNotification = false,
  showErrorNotification = true,
  successMessage,
  errorMessage,
  onError,
  ...fetchProps
}: UseDebouncedApiRequestProps): UseDebouncedApiRequestReturn<ResponseType, RequestParams> => {
  const { showError, showSuccess } = useNotification();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    success,
    data,
    error,
    executeDebounced: executeDebouncedFetch,
    ...fetchResult
  } = useDebouncedFetch<ResponseType, RequestParams>({
    ...fetchProps,
  });

  // Handle success notifications and callbacks
  useEffect(() => {
    if (success && data !== undefined) {
      if (showSuccessNotification && successMessage) {
        showSuccess(successMessage);
      }
    }
  }, [success, data, showSuccessNotification, successMessage, showSuccess]);

  // Handle error notifications and callbacks
  useEffect(() => {
    if (error) {
      if (showErrorNotification) {
        const message = errorMessage || error.message;
        showError(message);
      }

      if (onError) {
        onError(error);
      }
    }
  }, [error, showErrorNotification, errorMessage, showError, onError]);

  // Cancel any pending debounced execution
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Debounced execution
  const executeDebounced = useCallback(
    (params: RequestParams) => {
      cancel(); // Cancel any existing timeout

      timeoutRef.current = setTimeout(() => {
        executeDebouncedFetch(params);
        timeoutRef.current = null;
      }, debounceMs);
    },
    [cancel, executeDebouncedFetch, debounceMs],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    ...fetchResult,
    cancel,
    data,
    error,
    execute: executeDebounced,
    executeDebounced: executeDebouncedFetch,
    success,
  };
};
