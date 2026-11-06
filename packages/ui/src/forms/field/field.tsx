"use client";

import { useId } from "react";

import { Input } from "../input";
import { Label as LibraryLabel } from "../label/Label";
import { Textarea } from "../textarea";
import type { FieldOptions } from "../types";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  hint,
  required = false,
}: FieldOptions) {
  const fieldId = useId();
  return (
    <LibraryLabel
      className={multiline ? "editor-field full-width" : "editor-field"}
      htmlFor={fieldId}
      unstyled
    >
      <span>{label}</span>
      {multiline ? (
        <Textarea
          id={fieldId}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={4}
          value={value}
        />
      ) : (
        <Input
          id={fieldId}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          type={type}
          value={value}
        />
      )}{" "}
      {hint && <small>{hint}</small>}
    </LibraryLabel>
  );
}
