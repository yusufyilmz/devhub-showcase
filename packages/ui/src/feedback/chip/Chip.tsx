/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { Button as LibraryButton } from "../../buttons/button/Button";
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
        <LibraryButton
          className={chipStyles.element1}
          onClick={onClick}
          type="button"
          variant="unstyled"
        >
          {label}
        </LibraryButton>
      ) : (
        label
      )}
      {onRemove ? (
        <LibraryButton
          aria-label={`Remove ${label}`}
          className={chipStyles.element2}
          onClick={onRemove}
          type="button"
          variant="unstyled"
        >
          ×
        </LibraryButton>
      ) : null}
    </span>
  );
}
