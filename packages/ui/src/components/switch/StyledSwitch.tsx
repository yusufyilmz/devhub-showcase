import type React from "react";
import type { ChangeEvent } from "react";

import { cn } from "cn";

import { FlexCol, FlexRow } from "../flex";
import { Typography } from "../typography";
import { Switch } from "./Switch";

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

const colorSchemeClasses = {
  error: "data-[state=checked]:bg-destructive",
  primary: "data-[state=checked]:bg-primary",
  secondary: "data-[state=checked]:bg-secondary",
  success: "data-[state=checked]:bg-success",
  warning: "data-[state=checked]:bg-warning",
};

const colorSchemeBgClasses = {
  error: "bg-destructive/5 border-destructive/20",
  primary: "bg-primary/5 border-primary/20",
  secondary: "bg-secondary/5 border-secondary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
};

const colorSchemeTextClasses = {
  error: "text-destructive",
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
};

export const StyledSwitch = ({
  icon,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  variant = "standard",
  colorScheme = "primary",
  className,
}: StyledSwitchProps) => {
  const getContainerClasses = () => {
    switch (variant) {
      case "card":
        return cn(
          "p-4 rounded-xl border transition-all",
          checked
            ? cn(colorSchemeBgClasses[colorScheme], "hover:bg-opacity-80")
            : "bg-card border-border hover:border-border/80 hover:bg-accent/50",
        );
      case "minimal":
        return "py-2 px-0";
      default:
        return cn(
          "p-3 rounded-lg transition-all",
          checked ? colorSchemeBgClasses[colorScheme] : "hover:bg-accent/50",
        );
    }
  };

  // Create a synthetic event that matches React's ChangeEvent<HTMLInputElement>
  const handleSwitchChange = (newChecked: boolean) => {
    const syntheticEvent = {
      currentTarget: {
        checked: newChecked,
        type: "checkbox",
        value: newChecked ? "on" : "off",
      },
      preventDefault: () => {
        // Intentionally empty - required for synthetic event
      },
      stopPropagation: () => {
        // Intentionally empty - required for synthetic event
      },
      target: {
        checked: newChecked,
        type: "checkbox",
        value: newChecked ? "on" : "off",
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className={cn(getContainerClasses(), className)}>
      <FlexRow align="start" gap="md" justify="between">
        <FlexCol className="flex-1" gap="sm">
          <FlexRow align="center" gap="sm">
            {icon && (
              <div
                className={cn(
                  "flex items-center",
                  checked ? colorSchemeTextClasses[colorScheme] : "text-muted-foreground",
                )}
              >
                {icon}
              </div>
            )}
            <Typography
              className={cn(
                "font-semibold text-sm",
                checked ? colorSchemeTextClasses[colorScheme] : "text-foreground",
              )}
              variant="subtitle2"
            >
              {label}
            </Typography>
          </FlexRow>
          {description && (
            <Typography className="text-muted-foreground leading-relaxed" variant="caption">
              {description}
            </Typography>
          )}
        </FlexCol>

        <Switch
          checked={checked}
          className={colorSchemeClasses[colorScheme]}
          disabled={disabled}
          onCheckedChange={handleSwitchChange}
        />
      </FlexRow>
    </div>
  );
};

StyledSwitch.displayName = "StyledSwitch";

export default StyledSwitch;
