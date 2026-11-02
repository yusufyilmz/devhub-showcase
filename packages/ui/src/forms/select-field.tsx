"use client";

import { selectFieldStyles } from "./styles";
import type { EmptyStateOptions, SelectFieldOptions } from "./types";

export function SelectField({ label, value, onChange, children }: SelectFieldOptions) {
  return (
    <label className={selectFieldStyles.element1}>
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {children}
      </select>
    </label>
  );
}
export function EmptyState({ children }: EmptyStateOptions) {
  return <div className={selectFieldStyles.element2}>{children}</div>;
}
