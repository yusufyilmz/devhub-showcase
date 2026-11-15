import type { ReactNode } from "react";

import type { TooltipProps } from "../tooltip/types";

export interface AnimatedTooltipProps extends Omit<TooltipProps, "title"> {
  content: ReactNode;
  followCursor?: boolean;
  offset?: number;
}
