import type { ReactNode } from "react";

export type FieldOptions = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  hint?: string;
  required?: boolean;
};

export type LinesFieldOptions = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
};

export type SelectFieldOptions = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

export type EmptyStateOptions = { children: ReactNode };

export type EmptyStateOptions2 = { children: ReactNode };
