import { cardBodyClassName, cardBodyStyles } from "./styles";
import type { CardBodyProps } from "./types";

export function CardBody({ title, children, className }: CardBodyProps) {
  return (
    <div className={cardBodyClassName(className)}>
      {title && <h2 className={cardBodyStyles.element1}>{title}</h2>}
      {children}
    </div>
  );
}
