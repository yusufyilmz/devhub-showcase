// Base fetch hook

export type { FetchProps, FetchReturn } from "./useFetch";
export { useFetch } from "./useFetch";

// HTTP method hooks
// export { useGet } from './base/useGet'
// export { usePost } from './base/usePost'
// export { usePatch } from './base/usePatch'
// export { usePut } from './base/usePut'
// export { useDelete } from './base/useDelete'

export type { UseApiRequestProps, UseApiRequestReturn } from "../api/useApiRequest";
// Enhanced API request hook with notifications
export { useApiRequest } from "../api/useApiRequest";
// Enhanced debounced API request hook
export type {
  UseDebouncedApiRequestProps,
  UseDebouncedApiRequestReturn,
} from "../api/useDebouncedApiRequest";
export { useDebouncedApiRequest } from "../api/useDebouncedApiRequest";
// export { default as useDeleteDefault } from './base/useDelete'
// // Default exports
// export { default as useGetDefault } from './base/useGet'
// export { default as usePatchDefault } from './base/usePatch'
// export { default as usePostDefault } from './base/usePost'
// export { default as usePutDefault } from './base/usePut'
export type { DebouncedFetchProps, DebouncedFetchReturn } from "../debounced/useDebouncedFetch";
// Debounced hooks
export { useDebouncedFetch } from "../debounced/useDebouncedFetch";
export { useDebouncedGet } from "../debounced/useDebouncedGet";
export { useDebouncedPatch } from "../debounced/useDebouncedPatch";
export { useDebouncedPost } from "../debounced/useDebouncedPost";
