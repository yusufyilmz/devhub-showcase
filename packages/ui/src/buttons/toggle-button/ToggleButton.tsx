/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { Button as LibraryButton } from "../button/Button";
import { toggleButtonStyles } from "./styles";
import type { ToggleButtonOptions } from "./types";

export function ToggleButton({ label, selected = false, onClick, children }: ToggleButtonOptions) {
  return (
    <LibraryButton
      aria-pressed={selected}
      className={toggleButtonStyles.button}
      onClick={onClick}
      type="button"
      variant="ghost"
    >
      {label || children}
    </LibraryButton>
  );
}
