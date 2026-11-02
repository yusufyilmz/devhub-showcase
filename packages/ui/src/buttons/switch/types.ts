import type React from "react";
import type { ChangeEvent } from "react";

export interface StyledSwitchProps {
  /**
   * Whether the switch is checked
   */
  checked: boolean;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Color scheme for the switch
   * @default 'primary'
   */
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "error";
  /**
   * Description text below the label
   */
  description?: string;
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Icon to display next to the label
   */
  icon?: React.ReactNode;
  /**
   * Main label text
   */
  label: string;
  /**
   * Change handler
   */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Visual variant of the switch container
   * @default 'standard'
   */
  variant?: "standard" | "card" | "minimal";
}
