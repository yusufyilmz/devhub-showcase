import { useCallback, useEffect, useRef, useState } from "react";

import { logger } from "@shared/utils/client-logger";

import fetchTimeout from "./fetchTimeout";

// HTTP Status codes for better error handling
const HttpStatusCode = {
  BadGateway: 502,
  BadRequest: 400,
  Forbidden: 403,
  InternalServerError: 500,
  MethodNotAllowed: 405,
  NoContent: 204,
  NotFound: 404,
  Ok: 200,
  ServiceUnavailable: 503,
  TooManyRequests: 429,
  Unauthorized: 401,
} as const;

type ParsedClientResponse = {
  data: any;
  success: boolean;
  error?: string;
  statusCode: number;
};

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  [HttpStatusCode.BadRequest]: "Bad Request",
  [HttpStatusCode.Unauthorized]: "Unauthorized",
  [HttpStatusCode.Forbidden]: "Forbidden",
  [HttpStatusCode.NotFound]: "Not Found",
  [HttpStatusCode.MethodNotAllowed]: "Method Not Allowed",
  [HttpStatusCode.TooManyRequests]: "Too Many Requests",
  [HttpStatusCode.InternalServerError]: "Internal Server Error",
  [HttpStatusCode.BadGateway]: "Bad Gateway",
  [HttpStatusCode.ServiceUnavailable]: "Service Unavailable",
};

function responseContentType(response: Response) {
  return response.headers.get("content-type")?.toLowerCase() || "";
}

function clientErrorMessage(status: number, statusText: string) {
  return HTTP_ERROR_MESSAGES[status] || statusText || "Unknown Error";
}

async function readErrorBody(response: Response) {
  try {
    const contentType = responseContentType(response);
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (parseError) {
    logger.warn("🔐 [CLIENT] Failed to parse error response body:", { error: parseError }); // TODO: fix this
    return null;
  }
}

function parseMaybeJson(textData: string) {
  try {
    return JSON.parse(textData);
  } catch {
    return textData;
  }
}

async function readLooseBody(response: Response) {
  try {
    return await response.json();
  } catch {
    return response.text();
  }
}

async function readSuccessBody(response: Response) {
  const contentType = responseContentType(response);
  if (contentType.includes("application/json")) {
    return response.json();
  }
  if (contentType.includes("text/")) {
    return parseMaybeJson(await response.text());
  }
  if (contentType.includes("multipart/form-data")) {
    const formData = await response.formData();
    return Object.fromEntries(Object.entries(formData)) as Record<string, any>;
  }
  return readLooseBody(response);
}

function invalidFormat(response: Response, data: unknown): ParsedClientResponse {
  return {
    data,
    error: "Invalid response format",
    statusCode: response.status,
    success: false,
  };
}

function businessResult(response: Response, responseData: any): ParsedClientResponse {
  const status = responseData?.json?.status ?? response.status;
  const errorMessage = responseData?.json?.msg2user || responseData?.error || responseData?.message;

  if (status >= 200 && status < 300) {
    return {
      data: responseData,
      statusCode: status,
      success: true,
    };
  }

  return {
    data: responseData,
    error: errorMessage || response.statusText || "Unknown Error",
    statusCode: status ?? HttpStatusCode.InternalServerError,
    success: false,
  };
}

// Client-side response parsing logic similar to server parseResponse
async function parseClientResponse(response: Response): Promise<ParsedClientResponse> {
  if (response.status === HttpStatusCode.NoContent) {
    logger.debug("🔐 [CLIENT] No Content response");
    return {
      data: { message: "No Content", success: true },
      statusCode: response.status,
      success: true,
    };
  }

  if (response.status >= 400) {
    const errorMessage = clientErrorMessage(response.status, response.statusText);
    const errorData = await readErrorBody(response);
    return {
      data: errorData,
      error: errorData?.error || errorData?.message || errorMessage,
      statusCode: response.status,
      success: false,
    };
  }

  let responseData: any;
  try {
    responseData = await readSuccessBody(response);
  } catch (error) {
    logger.error("🔐 [CLIENT] parseClientResponse content-type parsing failed:", {
      data: { contentType: responseContentType(response), error },
    });
    return invalidFormat(response, null);
  }

  try {
    return businessResult(response, responseData);
  } catch (error) {
    logger.error("🔐 [CLIENT] parseClientResponse processing error:", { error });
    return invalidFormat(response, responseData);
  }
}

function requestHeadersFor(headers: Record<string, string>) {
  const authToken = headers.authToken;
  return new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(authToken && { authorization: `bearer ${authToken}` }),
    ...headers,
  });
}

function applyRequestParams(url: string, method: string, params: unknown) {
  if (method !== "GET" && method !== "HEAD" && params) {
    return { body: JSON.stringify(params), url };
  }
  if (method === "GET" && params) {
    return {
      url: `${url}?${new URLSearchParams(params as Record<string, string>).toString()}`,
    };
  }
  return { url };
}

async function commitClientResponse<ResponseType>(
  response: Response,
  method: string,
  requestUrl: string,
  params: unknown,
  setState: (result: FetchMethodReturn<ResponseType>) => void,
): Promise<FetchMethodReturn<ResponseType>> {
  const parsedResponse = await parseClientResponse(response);
  logger.trace("🔐 [CLIENT] useFetch parsedResponse:", { params, parsedResponse, url: requestUrl });

  const success = parsedResponse.success;
  const error = success ? null : new Error(parsedResponse.error || "Unknown error");
  const responseData = parsedResponse.data;

  if (!success) {
    logger.error(`Request failed: ${method} ${requestUrl}`, {
      data: responseData,
      error: parsedResponse.error,
      status: response.status,
      statusText: response.statusText,
    });
  }

  const result = {
    data: responseData,
    error,
    loading: false,
    statusCode: parsedResponse.statusCode,
    success,
  };
  setState(result);
  return result;
}

function handleRequestFailure<ResponseType>(
  err: unknown,
  isMounted: boolean,
  method: string,
  requestUrl: string,
  setState: (
    value:
      | FetchMethodReturn<ResponseType>
      | ((prev: FetchMethodReturn<ResponseType>) => FetchMethodReturn<ResponseType>),
  ) => void,
): FetchMethodReturn<ResponseType> | null {
  if (!isMounted) return null;

  const error = err instanceof Error ? err : new Error("Unknown error occurred");
  if (error.name === "AbortError") {
    logger.info(`Request aborted: ${method} ${requestUrl}`);
    return null;
  }

  logger.error(`Request error: ${method} ${requestUrl}`, { error });
  setState((prev) => ({
    ...prev,
    error,
    loading: false,
    success: false,
  }));

  return {
    data: null,
    error,
    loading: false,
    statusCode: null, // TODO: add status code from backend
    success: false,
  };
}

// Base interface for common properties
interface BaseProps {
  headers?: Record<string, string>;
  start: boolean;
  timeout?: number;
  url: string;
}

// GET/HEAD methods don't need data
type GetProps = {
  method: "GET" | "HEAD";
};

// POST/PUT/DELETE methods require data
type PostProps = {
  method: "POST" | "DELETE" | "PUT" | "PATCH";
  params?: object;
};

// Conditional props based on method
type ConditionalProps = GetProps | PostProps;

// Final props interface
export type FetchProps = BaseProps & ConditionalProps;

// Return type for the hook
export type FetchReturn<ResponseType, RequestParams = object> = {
  data: ResponseType | null;
  loading: boolean;
  error: Error | null;
  execute: (params: RequestParams) => Promise<FetchMethodReturn<ResponseType> | null>;
  statusCode: number | null;
  success: boolean;
};

export type FetchMethodReturn<ResponseType> = {
  data: ResponseType | null;
  loading: boolean;
  error: Error | null;
  statusCode: number | null;
  success: boolean;
};

// Custom hook for making HTTP requests
export const useFetch = <ResponseType = unknown, RequestParams = unknown>({
  url,
  method,
  headers = {},
  timeout = 30000,
}: FetchProps): FetchReturn<ResponseType, RequestParams> => {
  const [state, setState] = useState<{
    data: ResponseType | null;
    loading: boolean;
    error: Error | null;
    statusCode: number | null;
    success: boolean;
  }>({
    data: null,
    error: null,
    loading: false,
    statusCode: null,
    success: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const executeRequest = useCallback(
    async (params: RequestParams): Promise<FetchMethodReturn<ResponseType> | null> => {
      if (!isMountedRef.current) return null;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        error: null,
        loading: true,
        success: false,
      }));

      try {
        const requestConfig: RequestInit = {
          headers: requestHeadersFor(headers),
          method,
          signal: abortControllerRef.current.signal,
        };
        const nextRequest = applyRequestParams(url, method, params);
        url = nextRequest.url;
        if (nextRequest.body !== undefined) {
          requestConfig.body = nextRequest.body;
        }

        const response = await fetchTimeout(url, requestConfig, timeout);
        if (!isMountedRef.current) return null;

        return await commitClientResponse(response, method, url, params, setState);
      } catch (err) {
        return handleRequestFailure(err, isMountedRef.current, method, url, setState);
      }
    },
    [url, method, headers, timeout],
  );

  // Auto-start request when start is true
  // useEffect(() => {
  //   if (start) {
  //     // executeRequest(params)
  //   }
  // }, [start, executeRequest])

  // // Refresh function
  // const refresh = useCallback(
  //   async (params?: RequestParams): Promise<FetchMethodReturn<ResponseType> | null> => {
  //     // return await executeRequest(params)
  //   },
  //   [executeRequest]
  // )

  return {
    data: state.data,
    error: state.error,
    execute: executeRequest,
    loading: state.loading,
    statusCode: state.statusCode,
    success: state.success,
  };
};
