/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { useId } from "react";

import { Input as LibraryInput } from "../input/Input";
import { Label as LibraryLabel } from "../label/Label";
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
    <LibraryLabel
      className={radioButtonClassName(disabled ? "opacity-50" : "")}
      htmlFor={id}
      unstyled
    >
      <LibraryInput
        checked={isChecked}
        className={radioButtonStyles.element1}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onToggle}
        type="radio"
        unstyled
        value={value}
      />
      {label}
    </LibraryLabel>
  );
}
