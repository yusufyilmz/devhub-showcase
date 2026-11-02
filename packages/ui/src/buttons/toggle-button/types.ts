import type { ReactNode } from "react";

export type ToggleButtonOptions = {
  label?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};
