/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import type { ReactNode } from "react";

export function ToggleButton({
  label,
  selected = false,
  onClick,
  children,
}: {
  label?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      aria-pressed={selected}
      className={`rounded-lg px-3 py-1.5 text-sm ${
        selected
          ? "bg-button-primary text-button-light"
          : "text-textColor-secondary hover:bg-backgroundColor-lightestNavy"
      }`}
      onClick={onClick}
      type="button"
    >
      {label || children}
    </button>
  );
}
