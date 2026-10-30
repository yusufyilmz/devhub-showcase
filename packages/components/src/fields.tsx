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
    <label
      htmlFor={fieldId}
      className={multiline ? "editor-field full-width" : "editor-field"}
    >
      <span>{label}</span>
      {multiline ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          required={required}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
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
      label={label}
      value={value.join("\n")}
      onChange={(value) => onChange(value.split("\n"))}
      multiline
      hint={hint ?? "One item per line."}
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
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="editor-empty">{children}</div>;
}
