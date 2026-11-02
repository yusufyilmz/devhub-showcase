/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { Button as LibraryButton } from "../button/Button";
import { toggleButtonClassName } from "./styles";
import type { ToggleButtonOptions } from "./types";

export function ToggleButton({ label, selected = false, onClick, children }: ToggleButtonOptions) {
  return (
    <LibraryButton
      aria-pressed={selected}
      className={toggleButtonClassName(
        selected
          ? "bg-button-primary text-button-light"
          : "text-textColor-secondary hover:bg-backgroundColor-lightestNavy",
      )}
      onClick={onClick}
      type="button"
      variant="unstyled"
    >
      {label || children}
    </LibraryButton>
  );
}
