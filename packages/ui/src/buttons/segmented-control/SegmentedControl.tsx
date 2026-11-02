/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { useState } from "react";

import { segmentedControlClassName, segmentedControlStyles } from "./styles";
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
        <button
          aria-pressed={current === button.value}
          className={segmentedControlClassName(
            current === button.value
              ? "bg-button-primary text-button-light"
              : "text-textColor-secondary",
          )}
          key={button.value}
          onClick={() => {
            setInternal(button.value);
            onToggle(button.value);
          }}
          type="button"
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
