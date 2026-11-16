import { pressedToggleStyles } from "../toggle/styles";

export const toggleButtonStyles = {
  button: `h-auto min-h-9 min-w-0 max-w-full border-border/75 px-sm py-1 text-center leading-snug wrap-anywhere whitespace-normal text-muted-foreground ${pressedToggleStyles}`,
} as const;
