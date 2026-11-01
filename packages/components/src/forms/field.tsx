"use client";

import { useId } from "react";

import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  hint,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  hint?: string;
  required?: boolean;
}) {
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
