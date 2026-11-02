import type React from "react";

import { Button } from "../../buttons/button";
import { accordionHeaderClassName, accordionHeaderClassName2 } from "./styles";
import type { AccordionHeaderProps } from "./types";

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
      className={accordionHeaderClassName(className)}
      onClick={onClick}
      variant="text"
    >
      {children}
      <span className={accordionHeaderClassName2(isOpen ? "rotate-180 -translate-y-2" : "")}>
        {expandIcon}
      </span>
    </Button>
  );
};
