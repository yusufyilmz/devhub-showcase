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
      className={
        multiline
          ? "editor-field flex min-w-0 flex-col gap-[9px] text-xs text-muted-foreground [&_small]:text-[10px] [&_small]:leading-normal [&_small]:opacity-80 full-width col-span-full"
          : "editor-field flex min-w-0 flex-col gap-[9px] text-xs text-muted-foreground [&_small]:text-[10px] [&_small]:leading-normal [&_small]:opacity-80"
      }
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
