import type { ReactNode } from "react";

export type ListProps = {
  children: ReactNode;
  className?: string;
  divider?: boolean;
};

export interface ListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
