/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { useState } from "react";

export function SegmentedControl({
  buttons,
  selected,
  defaultSelected,
  onToggle,
}: {
  buttons: { value: string; label: string }[];
  selected?: string;
  defaultSelected?: string;
  onToggle: (value: string) => void;
}) {
  const [internal, setInternal] = useState(selected ?? defaultSelected ?? buttons[0]?.value ?? "");
  const current = selected ?? internal;
  return (
    <div className="inline-flex rounded-xl border border-main-lightest bg-backgroundColor-card p-1">
      {buttons.map((button) => (
        <button
          aria-pressed={current === button.value}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            current === button.value
              ? "bg-button-primary text-button-light"
              : "text-textColor-secondary"
          }`}
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
