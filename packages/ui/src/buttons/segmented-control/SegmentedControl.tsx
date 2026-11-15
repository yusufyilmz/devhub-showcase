/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { useState } from "react";

import { Button as LibraryButton } from "../button/Button";
import { segmentedControlStyles } from "./styles";
import type { SegmentedControlOptions } from "./types";

export function SegmentedControl({
  buttons,
  selected,
  defaultSelected,
  onToggle,
}: SegmentedControlOptions) {
  const [internal, setInternal] = useState(selected ?? defaultSelected ?? buttons[0]?.value ?? "");
  const current = selected ?? internal;
  return (
    <div className={segmentedControlStyles.element1}>
      {buttons.map((button) => (
        <LibraryButton
          aria-pressed={current === button.value}
          className={segmentedControlStyles.option}
          key={button.value}
          onClick={() => {
            setInternal(button.value);
            onToggle(button.value);
          }}
          type="button"
          variant="ghost"
        >
          {button.label}
        </LibraryButton>
      ))}
    </div>
  );
}
