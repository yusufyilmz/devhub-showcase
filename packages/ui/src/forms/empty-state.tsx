"use client";

import { emptyStateStyles } from "./styles";
import type { EmptyStateOptions2 } from "./types";

export function EmptyState({ children }: EmptyStateOptions2) {
  return <div className={emptyStateStyles.element1}>{children}</div>;
}
