import {
  type DebouncedFetchProps,
  type DebouncedFetchReturn,
  useDebouncedFetch,
} from "./useDebouncedFetch";

/**
 * Debounced GET request hook
 * Delays execution until after debounceMs milliseconds have elapsed since the last call
 */
export const useDebouncedGet = <ResponseType = unknown, RequestParams = object>(
  props: Omit<DebouncedFetchProps, "method">,
): DebouncedFetchReturn<ResponseType, RequestParams> => {
  return useDebouncedFetch<ResponseType, RequestParams>({
    method: "GET",
    ...props,
  });
};

export default useDebouncedGet;
