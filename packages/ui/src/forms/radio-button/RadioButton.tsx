/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { useId } from "react";

export function RadioButton({
  name,
  value,
  isChecked,
  onToggle,
  disabled,
  label,
}: {
  name: string;
  value: string;
  isChecked?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  label?: string;
}) {
  const id = useId();
  return (
    <label
      className={`inline-flex items-center gap-3 text-sm ${disabled ? "opacity-50" : ""}`}
      htmlFor={id}
    >
      <input
        checked={isChecked}
        className="size-4 accent-[rgb(var(--accent-rgb))]"
        disabled={disabled}
        id={id}
        name={name}
        onChange={onToggle}
        type="radio"
        value={value}
      />
      {label}
    </label>
  );
}
