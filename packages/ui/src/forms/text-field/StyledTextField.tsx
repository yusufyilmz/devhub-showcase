import { forwardRef } from "react";

import { cn } from "cn";

import { Typography } from "../../display/typography";
import { FlexCol } from "../../layout/flex/Flex";
import { Input } from "../input";
import { Label } from "../label";
import { styledTextFieldStyles } from "./styles";
import type { StyledTextFieldProps } from "./types";

export const StyledTextField = forwardRef<HTMLInputElement, StyledTextFieldProps>(
  ({ icon, label, helperText, error, variant = "standard", className, ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "glass":
          return cn(
            styledTextFieldStyles.getVariantClasses,
            styledTextFieldStyles.getVariantClasses2,
            styledTextFieldStyles.getVariantClasses3,
            styledTextFieldStyles.getVariantClasses4,
          );
        case "minimal":
          return cn(
            styledTextFieldStyles.getVariantClasses5,
            styledTextFieldStyles.getVariantClasses6,
            styledTextFieldStyles.getVariantClasses7,
            styledTextFieldStyles.getVariantClasses8,
          );
        default:
          return cn(
            styledTextFieldStyles.getVariantClasses9,
            styledTextFieldStyles.getVariantClasses10,
            styledTextFieldStyles.getVariantClasses11,
            styledTextFieldStyles.getVariantClasses12,
          );
      }
    };

    const hasError = !!error;

    return (
      <FlexCol className={styledTextFieldStyles.element1} gap="sm">
        {label && (
          <Label
            className={cn(
              styledTextFieldStyles.styledTextField,
              hasError && styledTextFieldStyles.styledTextField2,
            )}
            htmlFor={props.id}
          >
            {label}
          </Label>
        )}

        <div className={styledTextFieldStyles.element2}>
          {icon && <div className={styledTextFieldStyles.element3}>{icon}</div>}
          <Input
            aria-invalid={hasError}
            className={cn(
              getVariantClasses(),
              icon && styledTextFieldStyles.styledTextField3,
              hasError && styledTextFieldStyles.styledTextField4,
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>

        {(helperText || error) && (
          <Typography
            className={cn(
              styledTextFieldStyles.styledTextField5,
              hasError
                ? styledTextFieldStyles.styledTextField6
                : styledTextFieldStyles.styledTextField7,
            )}
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

export type { StyledTextFieldProps } from "./types";
