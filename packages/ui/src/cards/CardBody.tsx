import type { ReactNode } from "react";

interface CardBodyProps {
  children?: ReactNode;
  className?: string;
  title?: string;
}

export function CardBody({ title, children, className }: CardBodyProps) {
  return (
    <div className={`p-0 md:p-4 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
}
