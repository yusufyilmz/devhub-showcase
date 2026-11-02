import { accordionBodyClassName } from "./styles";
import type { AccordionBodyProps } from "./types";

export const AccordionBody: React.FC<AccordionBodyProps> = ({
  isOpen,
  children,
  className = "",
}) => {
  return (
    <div className={accordionBodyClassName(isOpen ? "block" : "hidden", className)}>{children}</div>
  );
};
