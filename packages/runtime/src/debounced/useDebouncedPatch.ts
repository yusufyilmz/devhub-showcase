import {
  type DebouncedFetchProps,
  type DebouncedFetchReturn,
  useDebouncedFetch,
} from "./useDebouncedFetch";

/**
 * Debounced PATCH request hook
 * Delays execution until after debounceMs milliseconds have elapsed since the last call
 */
export const useDebouncedPatch = <ResponseType = unknown, RequestParams = object>(
  props: Omit<DebouncedFetchProps, "method">,
): DebouncedFetchReturn<ResponseType, RequestParams> => {
  return useDebouncedFetch<ResponseType, RequestParams>({
    method: "PATCH",
    ...props,
  });
};

export default useDebouncedPatch;
