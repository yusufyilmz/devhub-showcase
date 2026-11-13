import type { CSSProperties } from "react";

import type { EmptyStateInlineStyle1Values } from "./types";

export const emptyStateStyles = {
  element1: "size-10 text-muted-foreground",
  element2: "flex size-20 items-center justify-center rounded-full bg-foreground/5",
  element3: "space-y-2 text-center",
  element4: "text-2xl font-semibold tracking-tight",
  element5: "text-muted-foreground",
  element6: "mt-4",
  emptyState: "flex flex-col items-center justify-center gap-6",
} as const;

export function emptyStateInlineStyle1(...values: EmptyStateInlineStyle1Values): CSSProperties {
  return { height: values[0] };
}
