/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import { colors, sizes, statusIndicatorClassName } from "./styles";
import type { StatusIndicatorProps } from "./types";

export function StatusIndicator({ size = "m", color = "green", ariaLabel }: StatusIndicatorProps) {
  return (
    <span
      aria-label={ariaLabel ?? `${color} status indicator`}
      className={statusIndicatorClassName(sizes[size], colors[color] ?? colors.gray)}
      role="img"
    />
  );
}
