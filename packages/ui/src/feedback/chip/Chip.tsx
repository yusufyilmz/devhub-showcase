/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import "./chip.css";

import { cn } from "cn";
import { X } from "lucide-react";

import { Button as LibraryButton } from "../../buttons/button/Button";
import { chipStyles } from "./styles";
import type { ChipOptions } from "./types";
export function Chip({ label, selected = true, onRemove, onClick }: ChipOptions) {
  return (
    <span className={cn(chipStyles.chip, selected ? chipStyles.selected : chipStyles.unselected)}>
      {onClick ? (
        <LibraryButton
          aria-pressed={selected}
          className={chipStyles.label}
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
          className={chipStyles.remove}
          onClick={onRemove}
          type="button"
          variant="unstyled"
        >
          <X aria-hidden="true" size={12} />
        </LibraryButton>
      ) : null}
    </span>
  );
}
