import { type FetchReturn, useFetch } from "./useFetch";

interface UsePutProps {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  start?: boolean;
  timeout?: number;
  url: string;
}

export const usePut = <ResponseType = unknown, RequestParams = object>({
  url,
  params,
  start = false,
  headers,
  timeout,
}: UsePutProps): FetchReturn<ResponseType, RequestParams> => {
  return useFetch<ResponseType, RequestParams>({
    headers,
    method: "PUT",
    params,
    start,
    timeout,
    url,
  });
};

export default usePut;

//
