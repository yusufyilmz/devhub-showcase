import type { ReactNode } from "react";

export type ListProps = {
  children: ReactNode;
  className?: string;
  divider?: boolean;
  noBorder?: boolean;
  listStyle?: "disc" | "circle" | "square" | "decimal" | "none";
};

export interface ListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
