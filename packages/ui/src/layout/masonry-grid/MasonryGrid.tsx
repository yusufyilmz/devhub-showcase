import { Children, type CSSProperties } from "react";

import { cn } from "cn";

import { flexGapStyle } from "../flex/flex-utils";
import { masonryGridStyles } from "./styles";
import type { MasonryGridProps } from "./types";

export function MasonryGrid({
  children,
  className,
  columns = 3,
  gap = "sm",
  l,
  m,
  s,
  style,
  ...props
}: MasonryGridProps) {
  const largeColumns = l?.columns ?? columns;
  const mediumColumns = m?.columns ?? largeColumns;
  const gridStyle = {
    "--masonry-columns": columns,
    "--masonry-columns-l": largeColumns,
    "--masonry-columns-m": mediumColumns,
    "--masonry-columns-s": s?.columns ?? 1,
    "--masonry-gap": typeof gap === "number" ? `${gap}rem` : flexGapStyle(gap),
    ...style,
  } as CSSProperties;

  return (
    <div
      {...props}
      className={cn(masonryGridStyles.grid, className)}
      data-slot="masonry-grid"
      style={gridStyle}
    >
      {Children.map(children, (child) =>
        child == null ? null : (
          <div className={masonryGridStyles.item} data-slot="masonry-item">
            {child}
          </div>
        ),
      )}
    </div>
  );
}
