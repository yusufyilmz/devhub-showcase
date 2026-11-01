import { useCallback, useEffect, useRef } from "react";

import { logger } from "@shared/utils/client-logger";

import {
  type FetchMethodReturn,
  type FetchProps,
  type FetchReturn,
  useFetch,
} from "../http/useFetch";

export interface DebouncedFetchProps extends Omit<FetchProps, "start"> {
  debounceMs?: number;
  onAfterUpdate?: () => void;
  onBeforeUpdate?: Array<(payload: any) => void>;
  onCreated?: Array<(data: any) => void>;
  onDebouncedChange?: Array<(data: any) => void>;
  onNoContent?: Array<(data: any) => void>;
  onSuccess?: Array<(data: any) => void>;
  onSuccessWithPayload?: Array<(data: any) => void>;
  onSuccessWithStateChange?: Array<(value: boolean) => void>;
  start?: boolean;
}

export interface DebouncedFetchReturn<ResponseType, RequestParams = object>
  extends Omit<FetchReturn<ResponseType, RequestParams>, "execute"> {
  cancel: () => void;
  executeDebounced: (params: RequestParams) => Promise<void>;
}

interface DebouncedUpdateHandlers {
  onAfterUpdate?: () => void;
  onBeforeUpdate: Array<(payload: any) => void>;
  onCreated: Array<(data: any) => void>;
  onNoContent: Array<(data: any) => void>;
  onSuccess: Array<(data: any) => void>;
  onSuccessWithPayload: Array<(data: any) => void>;
  onSuccessWithStateChange: Array<(value: boolean) => void>;
}

function callEach<T>(callbacks: Array<(value: T) => void>, value: T) {
  if (!Array.isArray(callbacks) || callbacks.length === 0) return;
  callbacks.forEach((callback) => {
    callback(value);
  });
}

function debouncedPayload(params: unknown) {
  return (params as Record<string, unknown>).paramsJsonb ?? params;
}

function notifyCreated(callbacks: Array<(data: any) => void>, params: unknown) {
  if (!Array.isArray(callbacks) || callbacks.length === 0) return;
  logger.warn("❓ useDebouncedFetch: onCreated");
  callEach(callbacks, debouncedPayload(params));
}

function dispatchDebouncedStatus(
  statusCode: number,
  data: unknown,
  params: unknown,
  handlers: Pick<DebouncedUpdateHandlers, "onCreated" | "onNoContent" | "onSuccess">,
) {
  if (statusCode === 200) {
    if (data) callEach(handlers.onSuccess, data);
    return;
  }
  if (statusCode === 201) {
    if (data) callEach(handlers.onNoContent, data);
    return;
  }
  if (statusCode === 204) {
    notifyCreated(handlers.onCreated, params);
    return;
  }
  logger.warn(`❌ useDebouncedFetch():unhandled res.status ${statusCode}`);
}

async function runDebouncedUpdate<ResponseType, RequestParams>(
  params: RequestParams,
  execute: (params: RequestParams) => Promise<FetchMethodReturn<ResponseType> | null>,
  handlers: DebouncedUpdateHandlers,
) {
  handlers.onBeforeUpdate.forEach((callback) => {
    callback(params as any);
  });

  const result = await execute(params);
  if (!result?.success || !result.statusCode) return;

  logger.info("useDebouncedFetch->execute()->res.status", {
    hasData: result.data !== null,
    status: result.statusCode,
    success: result.success,
  });
  logger.info(`${result.success ? "✅" : "❌"} useDebouncedFetch():${result.statusCode}`);
  dispatchDebouncedStatus(result.statusCode, result.data, params, handlers);
  callEach(handlers.onSuccessWithPayload, debouncedPayload(params));
  callEach(handlers.onSuccessWithStateChange, true);
  handlers.onAfterUpdate?.();
}

/**
 * Debounced version of useFetch hook
 * Delays execution until after debounceMs milliseconds have elapsed since the last call
 * Includes the same implementation pattern as the original debouncedFetch function
 */
export const useDebouncedFetch = <ResponseType = unknown, RequestParams = object>({
  debounceMs = 1500,
  start = false,
  onSuccess = [],
  onNoContent = [],
  onCreated = [],
  onSuccessWithPayload = [],
  onSuccessWithStateChange = [],
  onBeforeUpdate = [],
  onAfterUpdate,
  ...fetchProps
}: DebouncedFetchProps): DebouncedFetchReturn<ResponseType, RequestParams> => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchResult = useFetch<ResponseType, RequestParams>({ ...fetchProps, start } as FetchProps);

  // Cancel any pending debounced execution
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Debounced execution with status code handling
  const executeDebounced = useCallback(
    async (params: RequestParams) => {
      cancel(); // Cancel any existing timeout

      timeoutRef.current = setTimeout(async () => {
        timeoutRef.current = null;

        try {
          await runDebouncedUpdate(params, fetchResult.execute, {
            onAfterUpdate,
            onBeforeUpdate,
            onCreated,
            onNoContent,
            onSuccess,
            onSuccessWithPayload,
            onSuccessWithStateChange,
          });
        } catch (error) {
          logger.error("useDebouncedFetch error:", { error });
        }
      }, debounceMs);
    },
    [
      cancel,
      fetchResult.execute,
      debounceMs,
      onSuccess,
      onNoContent,
      onCreated,
      onSuccessWithPayload,
      onSuccessWithStateChange,
      onBeforeUpdate,
      onAfterUpdate,
    ],
  );

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    cancel();
  }, [cancel]);

  // Use useEffect for cleanup - moved to a ref to avoid dependency issues
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  return {
    cancel,
    data: fetchResult.data as ResponseType | null,
    error: fetchResult.error,
    executeDebounced,
    loading: fetchResult.loading,
    statusCode: fetchResult.statusCode,
    success: fetchResult.success,
  };
};

export default useDebouncedFetch;
