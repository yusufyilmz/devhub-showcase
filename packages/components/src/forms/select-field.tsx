"use client";

import type { ReactNode } from "react";

export function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {children}
      </select>
    </label>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="editor-empty">{children}</div>;
}
