import type React from "react";
import type { ReactNode } from "react";

import { Button } from "@shared/components";

type AccordionHeaderProps = {
  isOpen: boolean;
  onClick: () => void;
  expandIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  children,
  isOpen,
  onClick,
  expandIcon,
  className,
}) => {
  return (
    <Button
      aria-expanded={isOpen}
      aria-label="accordion header"
      className={`flex items-center flex-row justify-between w-full font-medium text-main-white border-b border-main-light-slate ${className}`}
      onClick={onClick}
      variant="text"
    >
      {children}
      <span
        className={`transform transition-transform ${isOpen ? "rotate-180 -translate-y-2" : ""}`}
      >
        {expandIcon}
      </span>
    </Button>
  );
};
