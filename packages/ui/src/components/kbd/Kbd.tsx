/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import type { ReactNode } from "react";

export function Kbd({ label, children }: { label?: string; children?: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-8 items-center justify-center rounded-md border border-main-lightest bg-backgroundColor-lightestNavy px-1 py-0.5 font-sans text-xs text-textColor-secondary">
      {label || children}
    </kbd>
  );
}
