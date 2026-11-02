"use client";

import { Field } from "./field";
import type { LinesFieldOptions } from "./types";

export function LinesField({ label, value, onChange, hint }: LinesFieldOptions) {
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
