"use client";
import type React from "react";
import { forwardRef, type ReactNode } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, tabIndex = -1, children, className = "", ...props }, ref) => {
    return (
      <div
        className={`rounded-lg overflow-hidden w-full ${className}`}
        id={id}
        ref={ref}
        tabIndex={tabIndex}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
