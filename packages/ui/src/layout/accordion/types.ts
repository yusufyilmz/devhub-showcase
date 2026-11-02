import type { ReactNode } from "react";

export type AccordionBodyProps = {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
};

export type AccordionHeaderProps = {
  isOpen: boolean;
  onClick: () => void;
  expandIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
};
