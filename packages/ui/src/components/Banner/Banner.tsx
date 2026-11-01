/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import type { ReactNode } from "react";

export function Banner({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex w-full items-center justify-center gap-3 bg-button-primary px-4 py-2 text-center text-sm font-medium text-button-light ${className}`}
    >
      {children}
    </div>
  );
}
