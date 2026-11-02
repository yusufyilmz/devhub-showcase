/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { chipStyles } from "./styles";
import type { ChipOptions } from "./types";
export function Chip({ label, selected = true, onRemove, onClick }: ChipOptions) {
  const classes = `inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm ${
    selected
      ? "border-main-green/50 bg-main-green/15 text-main-green"
      : "border-main-lightest text-textColor-secondary"
  }`;
  return (
    <span className={classes}>
      {onClick ? (
        <button className={chipStyles.element1} onClick={onClick} type="button">
          {label}
        </button>
      ) : (
        label
      )}
      {onRemove ? (
        <button
          aria-label={`Remove ${label}`}
          className={chipStyles.element2}
          onClick={onRemove}
          type="button"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
