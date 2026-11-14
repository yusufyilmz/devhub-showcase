import type { CSSProperties } from "react";

import type { EmptyStateInlineStyle1Values } from "./types";

export const emptyStateStyles = {
  element1: "size-6 text-muted-foreground",
  element2:
    "flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-foreground/5",
  element3: "w-full max-w-sm space-y-xs text-center wrap-anywhere",
  element4: "text-lg font-semibold tracking-tight",
  element5: "text-sm leading-relaxed text-muted-foreground",
  element6: "flex max-w-full flex-wrap justify-center gap-s",
  emptyState: "flex min-w-0 flex-col items-center justify-center gap-md px-sm",
} as const;

export function emptyStateInlineStyle1(...values: EmptyStateInlineStyle1Values): CSSProperties {
  return { height: values[0] };
}
