import type { MouseEvent } from "react";

import type { Button } from "../button";

export type ActionButtonColor = "primary" | "warning" | "danger" | "success" | "info";

export interface ActionButtonProps extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  colorScheme?: ActionButtonColor;
  fullWidth?: boolean;
  href?: string;
  loading?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  target?: string;
  variant?: "contained" | "outlined" | "ghost";
}
