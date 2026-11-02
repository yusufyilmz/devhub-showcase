import type { ChangeEvent } from "react";

import { cn } from "cn";

import { Typography } from "../../display/typography";
import { FlexCol, FlexRow } from "../../layout/flex";
import { Switch } from "./Switch";
import {
  colorSchemeBgClasses,
  colorSchemeClasses,
  colorSchemeTextClasses,
  styledSwitchStyles,
} from "./styles";
import type { StyledSwitchProps } from "./types";

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
          styledSwitchStyles.getContainerClasses,
          checked
            ? cn(colorSchemeBgClasses[colorScheme], styledSwitchStyles.getContainerClasses3)
            : styledSwitchStyles.getContainerClasses2,
        );
      case "minimal":
        return "py-2 px-0";
      default:
        return cn(
          styledSwitchStyles.getContainerClasses4,
          checked ? colorSchemeBgClasses[colorScheme] : styledSwitchStyles.getContainerClasses5,
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
        <FlexCol className={styledSwitchStyles.element1} gap="sm">
          <FlexRow align="center" gap="sm">
            {icon && (
              <div
                className={cn(
                  styledSwitchStyles.styledSwitch,
                  checked ? colorSchemeTextClasses[colorScheme] : styledSwitchStyles.styledSwitch2,
                )}
              >
                {icon}
              </div>
            )}
            <Typography
              className={cn(
                styledSwitchStyles.styledSwitch3,
                checked ? colorSchemeTextClasses[colorScheme] : styledSwitchStyles.styledSwitch4,
              )}
              variant="subtitle2"
            >
              {label}
            </Typography>
          </FlexRow>
          {description && (
            <Typography className={styledSwitchStyles.element2} variant="caption">
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

export type { StyledSwitchProps } from "./types";
