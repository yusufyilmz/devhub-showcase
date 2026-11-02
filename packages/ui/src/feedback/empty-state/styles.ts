import type { CSSProperties } from "react";

import type { EmptyStateInlineStyle1Values } from "./types";

export const emptyStateStyles = {
  element1: "w-10 h-10 text-gray-500 dark:text-gray-400",
  element2: "flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-800",
  element3: "space-y-2 text-center",
  element4: "text-2xl font-bold tracking-tight",
  element5: "text-gray-500 dark:text-gray-400",
  element6: "mt-4",
  emptyState: "flex flex-col items-center justify-center gap-6",
} as const;

export function emptyStateInlineStyle1(...values: EmptyStateInlineStyle1Values): CSSProperties {
  return { height: values[0] };
}
