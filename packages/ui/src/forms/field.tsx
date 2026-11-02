"use client";

import { useId } from "react";

import { Input } from "./input";
import { Textarea } from "./textarea";
import type { FieldOptions } from "./types";

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
    <label className={multiline ? "editor-field full-width" : "editor-field"} htmlFor={fieldId}>
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
    </label>
  );
}
