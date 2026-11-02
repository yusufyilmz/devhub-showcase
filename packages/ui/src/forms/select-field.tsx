"use client";

import { Label as LibraryLabel } from "./label/Label";
import { NativeSelect as LibraryNativeSelect } from "./native-select";
import { selectFieldStyles } from "./styles";
import type { EmptyStateOptions, SelectFieldOptions } from "./types";

export function SelectField({ label, value, onChange, children }: SelectFieldOptions) {
  return (
    <LibraryLabel className={selectFieldStyles.element1} unstyled>
      <span>{label}</span>
      <LibraryNativeSelect
        onChange={(event) => onChange(event.target.value)}
        unstyled
        value={value}
      >
        {children}
      </LibraryNativeSelect>
    </LibraryLabel>
  );
}
export function EmptyState({ children }: EmptyStateOptions) {
  return <div className={selectFieldStyles.element2}>{children}</div>;
}
