import type React from "react";
import { forwardRef } from "react";

import { cn } from "cn";

import { Typography } from "../../display/typography";
import { FlexCol } from "../../layout/flex/Flex";
import { Input } from "../input";
import { Label } from "../label";

export interface StyledTextFieldProps extends Omit<React.ComponentProps<typeof Input>, "variant"> {
  /**
   * Error message (overrides helperText and adds error styling)
   */
  error?: string;
  /**
   * Helper text below the input
   */
  helperText?: string;
  /**
   * Icon to display at the start of the input
   */
  icon?: React.ReactNode;
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Visual variant of the text field
   * @default 'standard'
   */
  variant?: "standard" | "glass" | "minimal";
}

export const StyledTextField = forwardRef<HTMLInputElement, StyledTextFieldProps>(
  ({ icon, label, helperText, error, variant = "standard", className, ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "glass":
          return cn(
            "bg-card/60 backdrop-blur-md border-border/50",
            "hover:bg-card/80 hover:backdrop-blur-lg hover:border-primary/40",
            "focus:bg-card focus:backdrop-blur-xl focus:border-primary focus:border-2",
            "transition-all duration-300",
          );
        case "minimal":
          return cn(
            "bg-transparent border-border/30",
            "hover:border-primary/50",
            "focus:border-primary",
            "transition-colors",
          );
        default:
          return cn(
            "bg-card border-border",
            "hover:bg-card/90 hover:border-primary/30",
            "focus:bg-card focus:border-primary focus:border-2",
            "transition-all",
          );
      }
    };

    const hasError = !!error;

    return (
      <FlexCol className="w-full" gap="sm">
        {label && (
          <Label className={cn("font-medium", hasError && "text-destructive")} htmlFor={props.id}>
            {label}
          </Label>
        )}

        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-primary">
              {icon}
            </div>
          )}
          <Input
            aria-invalid={hasError}
            className={cn(
              getVariantClasses(),
              icon && "pl-10",
              hasError &&
                "border-destructive aria-invalid:border-destructive focus:border-destructive",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>

        {(helperText || error) && (
          <Typography
            className={cn("ml-1", hasError ? "text-destructive" : "text-muted-foreground")}
            variant="caption"
          >
            {error || helperText}
          </Typography>
        )}
      </FlexCol>
    );
  },
);

StyledTextField.displayName = "StyledTextField";

export default StyledTextField;
