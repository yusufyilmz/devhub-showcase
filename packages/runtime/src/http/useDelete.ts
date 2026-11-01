import { type FetchReturn, useFetch } from "./useFetch";

interface UseDeleteProps {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  start?: boolean;
  timeout?: number;
  url: string;
}

export const useDelete = <ResponseType = unknown, RequestParams = object>({
  url,
  start = false,
  headers,
  timeout,
  params,
}: UseDeleteProps): FetchReturn<ResponseType, RequestParams> => {
  return useFetch<ResponseType, RequestParams>({
    headers,
    method: "DELETE",
    params,
    start,
    timeout,
    url,
  });
};

export default useDelete;
