import { cn } from "cn";

import { dividerStyles } from "./styles";
import type { DividerProps } from "./types";

export const Divider = ({ className }: DividerProps) => {
  return <hr className={cn(dividerStyles.divider, className)} />;
};
