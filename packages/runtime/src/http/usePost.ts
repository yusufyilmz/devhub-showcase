import { type FetchReturn, useFetch } from "./useFetch";

interface UsePostProps {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  start?: boolean;
  timeout?: number;
  url: string;
}

export const usePost = <ResponseType = unknown, RequestParams = object>({
  url,
  start = false,
  headers,
  timeout,
  params,
}: UsePostProps): FetchReturn<ResponseType, RequestParams> => {
  return useFetch<ResponseType, RequestParams>({
    headers,
    method: "POST",
    params,
    start,
    timeout,
    url,
  });
};

export default usePost;
