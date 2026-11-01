import {
  type DebouncedFetchProps,
  type DebouncedFetchReturn,
  useDebouncedFetch,
} from "./useDebouncedFetch";

/**
 * Debounced POST request hook
 * Delays execution until after debounceMs milliseconds have elapsed since the last call
 */
export const useDebouncedPost = <ResponseType = unknown, RequestParams = object>(
  props: Omit<DebouncedFetchProps, "method">,
): DebouncedFetchReturn<ResponseType, RequestParams> => {
  return useDebouncedFetch<ResponseType, RequestParams>({
    method: "POST",
    ...props,
  });
};

export default useDebouncedPost;
