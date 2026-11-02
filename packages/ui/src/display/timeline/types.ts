import type { ReactNode } from "react";

export type TimelineProps = {
  children: ReactNode;
  className?: string;
};

export type TimelineItemProps = {
  children: ReactNode;
  className?: string;
};

export type TimelineHeaderProps = {
  children: ReactNode;
  className?: string;
};

export type TimelineIconProps = {
  color?: string;
  className?: string;
};

export type TimelineConnectorProps = {
  color?: string;
  className?: string;
};

export type TimelineBodyProps = {
  children: ReactNode;
  className?: string;
};
