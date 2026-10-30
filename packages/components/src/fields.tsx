"use client";
import { type ReactNode, useId } from "react";
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
        <textarea
          id={fieldId}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={4}
          value={value}
        />
      ) : (
        <input
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
