"use client";

import { Field } from "./field";

export function LinesField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}) {
  return (
    <Field
      hint={hint ?? "One item per line."}
      label={label}
      multiline
      onChange={(value) => onChange(value.split("\n"))}
      value={value.join("\n")}
    />
  );
}
