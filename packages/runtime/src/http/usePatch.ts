import { type FetchReturn, useFetch } from "./useFetch";

interface UsePatchProps {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  start?: boolean;
  timeout?: number;
  url: string;
}

export const usePatch = <ResponseType = unknown, RequestParams = object>({
  url,
  params,
  start = false,
  headers,
  timeout,
}: UsePatchProps): FetchReturn<ResponseType, RequestParams> => {
  return useFetch<ResponseType, RequestParams>({
    headers,
    method: "PATCH",
    params,
    start,
    timeout,
    url,
  });
};

export default usePatch;
