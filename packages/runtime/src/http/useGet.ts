import { type FetchReturn, useFetch } from "./useFetch";

interface UseGetProps {
  headers?: Record<string, string>;
  start?: boolean;
  timeout?: number;
  url: string;
}

export const useGet = <ResponseType = unknown, RequestParams = object>({
  url,
  start = false,
  headers,
  timeout,
}: UseGetProps): FetchReturn<ResponseType, RequestParams> => {
  return useFetch<ResponseType, RequestParams>({
    headers,
    method: "GET",
    start,
    timeout,
    url,
  });
};

export default useGet;
