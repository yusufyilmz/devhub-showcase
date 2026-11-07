import type { ComponentProps } from "react";

import type { SpacingToken } from "../flex/types";

type MasonryBreakpoint = { columns?: number };

export type MasonryGridProps = ComponentProps<"div"> & {
  columns?: number;
  gap?: SpacingToken | number;
  l?: MasonryBreakpoint;
  m?: MasonryBreakpoint;
  s?: MasonryBreakpoint;
};
