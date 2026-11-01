/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import type { ReactNode } from "react";

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-main-lightest bg-backgroundColor-lightestNavy px-1 py-0.5 font-mono text-[0.9em] text-textColor-primary">
      {children}
    </code>
  );
}
