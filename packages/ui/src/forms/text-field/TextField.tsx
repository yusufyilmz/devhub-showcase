"use client";

import React from "react";

import { cn } from "cn";

import { IconButton } from "../../buttons/icon-button";
import { Typography } from "../../display/typography";
import { Flex, FlexCenter, FlexCol } from "../../layout/flex";
import { Input as LibraryInput } from "../input/Input";
import { Label } from "../label";
import { Textarea as LibraryTextarea } from "../textarea/Textarea";
import { helperTextVariants, textFieldStyles, textFieldVariants } from "./styles";
import type {
  FieldLabelOptions,
  FieldMessageOptions,
  FieldStateOptions,
  SearchFieldProps,
  TextAreaProps,
  TextFieldProps,
} from "./types";

function fieldState(error?: string, success?: string, warning?: string, state?: FieldStateOptions) {
  if (error) return "error" as const;
  if (success) return "success" as const;
  if (warning) return "warning" as const;
  return state;
}

function fieldHelperText(error?: string, success?: string, warning?: string, helperText?: string) {
  return error || success || warning || helperText;
}

function FieldLabel({ className, htmlFor, label, required }: FieldLabelOptions) {
  if (!label) return null;
  return (
    <Label className={cn(className, required && textFieldStyles.fieldLabel)} htmlFor={htmlFor}>
      {label}
    </Label>
  );
}

function FieldMessage({ className, errorId, helperId, state, text }: FieldMessageOptions) {
  if (!text) return null;
  return (
    <Typography
      className={cn(helperTextVariants({ state }), className)}
      id={state === "error" ? errorId : helperId}
      variant="caption"
    >
      {text}
    </Typography>
  );
}

export function TextField({
  className,
  variant,
  size,
  state,
  label,
  helperText,
  error,
  success,
  warning,
  required = false,
  leftIcon,
  rightIcon,
  containerClassName,
  labelClassName,
  helperClassName,
  fullWidth,
  fullHeight,
  id: idProp,
  ...props
}: TextFieldProps) {
  const id = React.useId();
  const inputId = idProp || id;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const currentState = fieldState(error, success, warning, state);
  const currentHelperText = fieldHelperText(error, success, warning, helperText);

  return (
    <FlexCol className={cn(textFieldStyles.textField, containerClassName)} gap="xs">
      <FieldLabel className={labelClassName} htmlFor={inputId} label={label} required={required} />

      <Flex className={textFieldStyles.element1}>
        {leftIcon && <FlexCenter className={textFieldStyles.element2}>{leftIcon}</FlexCenter>}

        <LibraryInput
          aria-describedby={
            currentHelperText ? (currentState === "error" ? errorId : helperId) : undefined
          }
          aria-invalid={currentState === "error" ? "true" : "false"}
          className={cn(
            textFieldVariants({ size, state: currentState, variant }),
            leftIcon && textFieldStyles.textField2,
            rightIcon && textFieldStyles.textField3,
            fullWidth && textFieldStyles.textField4,
            fullHeight && textFieldStyles.textField5,
            className,
          )}
          id={inputId}
          required={required}
          unstyled
          {...props}
        />

        {rightIcon && <FlexCenter className={textFieldStyles.element3}>{rightIcon}</FlexCenter>}
      </Flex>

      <FieldMessage
        className={helperClassName}
        errorId={errorId}
        helperId={helperId}
        state={currentState}
        text={currentHelperText}
      />
    </FlexCol>
  );
}

// Textarea variant

export function TextArea({
  className,
  variant,
  size,
  state,
  label,
  helperText,
  error,
  success,
  warning,
  required = false,
  containerClassName,
  labelClassName,
  helperClassName,
  resize = "vertical",
  id: idProp,
  ...props
}: TextAreaProps) {
  const id = React.useId();
  const inputId = idProp || id;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const currentState = fieldState(error, success, warning, state);
  const currentHelperText = fieldHelperText(error, success, warning, helperText);

  return (
    <FlexCol className={cn(textFieldStyles.textArea, containerClassName)} gap="xs">
      <FieldLabel className={labelClassName} htmlFor={inputId} label={label} required={required} />

      <LibraryTextarea
        aria-describedby={
          currentHelperText ? (currentState === "error" ? errorId : helperId) : undefined
        }
        aria-invalid={currentState === "error" ? "true" : "false"}
        className={cn(
          textFieldVariants({ size, state: currentState, variant }),
          textFieldStyles.textArea2,
          resize === "both" && textFieldStyles.textArea3,
          resize === "horizontal" && textFieldStyles.textArea4,
          resize === "vertical" && textFieldStyles.textArea5,
          resize === "none" && textFieldStyles.textArea6,
          className,
        )}
        id={inputId}
        required={required}
        unstyled
        {...props}
      />

      <FieldMessage
        className={helperClassName}
        errorId={errorId}
        helperId={helperId}
        state={currentState}
        text={currentHelperText}
      />
    </FlexCol>
  );
}

// Search input variant

export function SearchField({
  onClear,
  showClearButton = true,
  value,
  ...props
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = React.useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setInternalValue("");
    onClear?.();
  };

  return (
    <TextField
      {...props}
      onChange={handleChange}
      rightIcon={
        showClearButton && internalValue ? (
          <IconButton
            aria-label="Clear search"
            className={textFieldStyles.element4}
            onClick={handleClear}
            size="sm"
            type="button"
            variant="ghost"
          >
            ✕
          </IconButton>
        ) : (
          <Typography className={textFieldStyles.element5} variant="body2">
            🔍
          </Typography>
        )
      }
      value={internalValue}
    />
  );
}

export { helperTextVariants, labelVariants } from "./styles";
export type { SearchFieldProps, TextAreaProps, TextFieldProps } from "./types";
