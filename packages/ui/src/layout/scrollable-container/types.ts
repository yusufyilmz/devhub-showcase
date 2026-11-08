import type React from "react";
import type { CSSProperties } from "react";

import type { CVCategoryType } from "../../../../lib/src/types";

export interface ScrollableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  category?: CVCategoryType;
  children: React.ReactNode;
}

export type ScrollableContainerInlineStyle1Values = [CSSProperties["top"]];

export type ScrollableContainerInlineStyle2Values = [CSSProperties["top"]];
