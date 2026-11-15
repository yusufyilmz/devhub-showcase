import { pressedToggleStyles } from "../toggle/styles";

export const toggleButtonStyles = {
  button: `border-border text-muted-foreground ${pressedToggleStyles}`,
} as const;
