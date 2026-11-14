"use client";

import { useId } from "react";

import { cn } from "cn";

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
  const labelId = `${fieldId}-label`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  return (
    <LibraryLabel
      className={cn(
        "editor-field flex min-w-0 flex-col gap-xs text-sm font-medium text-foreground",
        multiline && "full-width col-span-full",
      )}
      htmlFor={fieldId}
      unstyled
    >
      <span id={labelId}>{label}</span>
      {multiline ? (
        <Textarea
          aria-describedby={hintId}
          aria-labelledby={labelId}
          id={fieldId}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={4}
          value={value}
        />
      ) : (
        <Input
          aria-describedby={hintId}
          aria-labelledby={labelId}
          id={fieldId}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          type={type}
          value={value}
        />
      )}
      {hint && (
        <small className="text-xs font-normal leading-normal text-muted-foreground" id={hintId}>
          {hint}
        </small>
      )}
    </LibraryLabel>
  );
}
