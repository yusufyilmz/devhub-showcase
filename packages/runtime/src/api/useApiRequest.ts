import { useEffect } from "react";

import { type FetchProps, type FetchReturn, useFetch } from "../http/useFetch";
import { useNotification } from "../notifications";

export interface ApiRequestOptions {
  errorMessage?: string;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
  showErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  successMessage?: string;
}

export type UseApiRequestProps = FetchProps & ApiRequestOptions;

export type UseApiRequestReturn<ResponseType, RequestParams = object> = FetchReturn<
  ResponseType,
  RequestParams
>;

/**
 * Enhanced fetch hook with automatic error/success notifications
 * and additional callback options
 */
export const useApiRequest = <ResponseType = unknown, RequestParams = object>({
  showSuccessNotification = false,
  showErrorNotification = true,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  ...fetchProps
}: UseApiRequestProps): UseApiRequestReturn<ResponseType, RequestParams> => {
  const { showError, showSuccess } = useNotification();
  const fetchResult = useFetch<ResponseType, RequestParams>(fetchProps);

  // Handle success notifications and callbacks
  useEffect(() => {
    if (fetchResult.success && fetchResult.data !== undefined) {
      if (showSuccessNotification && successMessage) {
        showSuccess(successMessage);
      }

      if (onSuccess) {
        onSuccess(fetchResult.data);
      }
    }
  }, [
    fetchResult.success,
    fetchResult.data,
    showSuccessNotification,
    successMessage,
    onSuccess,
    showSuccess,
  ]);

  // Handle error notifications and callbacks
  useEffect(() => {
    if (fetchResult.error) {
      if (showErrorNotification) {
        const message = `${errorMessage} Details: ${fetchResult.error.message}`;
        showError(message);
      }

      if (onError) {
        onError(fetchResult.error);
      }
    }
  }, [fetchResult.error, showErrorNotification, errorMessage, onError, showError]);

  return {
    ...fetchResult,
    execute: fetchResult.execute,
  };
};
