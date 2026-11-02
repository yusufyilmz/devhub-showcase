import type { colors, sizes } from "./styles";

export interface StatusIndicatorProps {
  ariaLabel?: string;
  color?: keyof typeof colors;
  size?: keyof typeof sizes;
}
