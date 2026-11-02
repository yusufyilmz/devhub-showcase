import type React from "react";

import {
  timelineClassName,
  timelineClassName2,
  timelineClassName3,
  timelineClassName4,
  timelineClassName5,
  timelineClassName6,
} from "./styles";
import type {
  TimelineBodyProps,
  TimelineConnectorProps,
  TimelineHeaderProps,
  TimelineIconProps,
  TimelineItemProps,
  TimelineProps,
} from "./types";

export const Timeline: React.FC<TimelineProps> = ({ children, className = "" }) => {
  return <ol className={timelineClassName(className)}>{children}</ol>;
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ children, className = "" }) => {
  return <li className={timelineClassName2(className)}>{children}</li>;
};

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({ children, className = "" }) => {
  return <div className={timelineClassName3(className)}>{children}</div>;
};

export const TimelineIcon: React.FC<TimelineIconProps> = ({
  color = "bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-900",
  className = "",
}) => {
  return <div className={timelineClassName4(color, className)} />;
};

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({
  color = "bg-gray-200 dark:bg-gray-700",
  className = "",
}) => {
  return <div className={timelineClassName5(color, className)} />;
};

export const TimelineBody: React.FC<TimelineBodyProps> = ({ children, className = "" }) => {
  return <div className={timelineClassName6(className)}>{children}</div>;
};
