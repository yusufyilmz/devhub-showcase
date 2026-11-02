import type * as React from "react";
import type { CSSProperties } from "react";

export interface EmptyStateProps {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  height?: string;
  icon?: React.ReactNode;
  title?: string;
}

export type EmptyStateInlineStyle1Values = [CSSProperties["height"]];
