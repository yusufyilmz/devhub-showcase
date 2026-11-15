import type * as React from "react";

import { cn } from "cn";

import { emptyStateInlineStyle1, emptyStateStyles } from "./styles";
import type { EmptyStateProps } from "./types";

export function EmptyState({
  className,
  title = "No data to display",
  description = "It looks like there's no data available yet. Try adding some new items.",
  icon,
  children,
  height = "50vh",
  ...props
}: EmptyStateProps) {
  const defaultIcon = <InboxIcon aria-hidden="true" className={emptyStateStyles.element1} />;

  return (
    <div
      className={cn(emptyStateStyles.emptyState, className)}
      style={emptyStateInlineStyle1(height)}
      {...props}
    >
      <div className={emptyStateStyles.element2}>{icon || defaultIcon}</div>
      <div className={emptyStateStyles.element3}>
        <h2 className={emptyStateStyles.element4}>{title}</h2>
        <p className={emptyStateStyles.element5}>{description}</p>
      </div>
      {children && <div className={emptyStateStyles.element6}>{children}</div>}
    </div>
  );
}

function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
