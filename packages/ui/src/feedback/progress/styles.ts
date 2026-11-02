import type { CSSProperties } from "react";

import type { ProgressInlineStyle1Values } from "./types";

export const progressStyles = {
  element1: "bg-primary h-full w-full flex-1 transition-all",
  progress: "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
} as const;

export function progressInlineStyle1(...values: ProgressInlineStyle1Values): CSSProperties {
  return { transform: values[0] };
}
