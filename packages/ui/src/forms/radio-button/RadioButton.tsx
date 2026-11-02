/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { useId } from "react";

import { radioButtonClassName, radioButtonStyles } from "./styles";
import type { RadioButtonOptions } from "./types";

export function RadioButton({
  name,
  value,
  isChecked,
  onToggle,
  disabled,
  label,
}: RadioButtonOptions) {
  const id = useId();
  return (
    <label className={radioButtonClassName(disabled ? "opacity-50" : "")} htmlFor={id}>
      <input
        checked={isChecked}
        className={radioButtonStyles.element1}
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
