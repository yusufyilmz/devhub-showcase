"use client";

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Flex, FlexCenter, FlexCol } from "../Flex";
import { IconButton } from "../icon-button";
import { Label } from "../Label";
import { Typography } from "../Typography";

const textFieldVariants = cva(
  "flex w-full rounded-[var(--radius-m)] border border-[var(--border)] bg-[var(--background)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    defaultVariants: {
      size: "default",
      state: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-[calc(var(--spacing-xl))] px-[var(--spacing-md)] text-sm",
        lg: "h-[calc(var(--spacing-2xl))] px-[var(--spacing-lg)] text-base",
        sm: "h-[calc(var(--spacing-lg))] px-[var(--spacing-sm)] text-xs",
      },
      state: {
        default: "",
        error:
          "border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20",
        success:
          "border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20",
        warning:
          "border-[var(--warning)] focus:border-[var(--warning)] focus:ring-[var(--warning)]/20",
      },
      variant: {
        default: "border-[var(--border)]",
        destructive:
          "border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20",
        info: "border-[var(--info)] focus:border-[var(--info)] focus:ring-[var(--info)]/20",
        primary: "border-[var(--primary)] focus:border-[var(--primary)]",
        success:
          "border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20",
        warning:
          "border-[var(--warning)] focus:border-[var(--warning)] focus:ring-[var(--warning)]/20",
      },
    },
  },
);

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    defaultVariants: {
      required: false,
    },
    variants: {
      required: {
        false: "",
        true: "after:content-['*'] after:ml-0.5 after:text-[var(--destructive)]",
      },
    },
  },
);

export const helperTextVariants = cva("text-xs leading-none", {
  defaultVariants: {
    state: "default",
  },
  variants: {
    state: {
      default: "text-[var(--muted-foreground)]",
      error: "text-[var(--destructive)]",
      success: "text-[var(--success)]",
      warning: "text-[var(--warning)]",
    },
  },
});

export interface TextFieldProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof textFieldVariants> {
  containerClassName?: string;
  error?: string;
  fullHeight?: boolean;
  fullWidth?: boolean;
  helperClassName?: string;
  helperText?: string;
  label?: string;
  labelClassName?: string;
  leftIcon?: React.ReactNode;
  required?: boolean;
  rightIcon?: React.ReactNode;
  success?: string;
  warning?: string;
}

function fieldState(
  error?: string,
  success?: string,
  warning?: string,
  state?: "default" | "error" | "success" | "warning" | null,
) {
  if (error) return "error" as const;
  if (success) return "success" as const;
  if (warning) return "warning" as const;
  return state;
}

function fieldHelperText(error?: string, success?: string, warning?: string, helperText?: string) {
  return error || success || warning || helperText;
}

function FieldLabel({
  className,
  htmlFor,
  label,
  required,
}: {
  className?: string;
  htmlFor: string;
  label?: string;
  required?: boolean;
}) {
  if (!label) return null;
  return (
    <Label
      className={cn(
        className,
        required && "after:ml-0.5 after:text-destructive after:content-['*']",
      )}
      htmlFor={htmlFor}
    >
      {label}
    </Label>
  );
}

function FieldMessage({
  className,
  errorId,
  helperId,
  state,
  text,
}: {
  className?: string;
  errorId: string;
  helperId: string;
  state?: "default" | "error" | "success" | "warning" | null;
  text?: string;
}) {
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
    <FlexCol className={cn("w-full", containerClassName)} gap="xs">
      <FieldLabel className={labelClassName} htmlFor={inputId} label={label} required={required} />

      <Flex className="relative">
        {leftIcon && (
          <FlexCenter className="absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
            {leftIcon}
          </FlexCenter>
        )}

        <input
          aria-describedby={currentHelperText ? helperId : undefined}
          aria-invalid={currentState === "error" ? "true" : "false"}
          className={cn(
            textFieldVariants({ size, state: currentState, variant }),
            leftIcon && "pl-[calc(var(--spacing-md)+var(--spacing-sm)+1rem)]",
            rightIcon && "pr-[calc(var(--spacing-md)+var(--spacing-sm)+1rem)]",
            fullWidth && "w-full",
            fullHeight && "h-full",
            className,
          )}
          id={inputId}
          {...props}
        />

        {rightIcon && (
          <FlexCenter className="absolute right-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
            {rightIcon}
          </FlexCenter>
        )}
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
export interface TextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textFieldVariants> {
  containerClassName?: string;
  error?: string;
  helperClassName?: string;
  helperText?: string;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  resize?: "none" | "both" | "horizontal" | "vertical";
  success?: string;
  warning?: string;
}

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
    <FlexCol className={cn("w-full", containerClassName)} gap="xs">
      <FieldLabel className={labelClassName} htmlFor={inputId} label={label} required={required} />

      <textarea
        aria-describedby={currentHelperText ? helperId : undefined}
        aria-invalid={currentState === "error" ? "true" : "false"}
        className={cn(
          textFieldVariants({ size, state: currentState, variant }),
          "min-h-[calc(var(--spacing-xl)*2)] resize-none",
          resize === "both" && "resize",
          resize === "horizontal" && "resize-x",
          resize === "vertical" && "resize-y",
          resize === "none" && "resize-none",
          className,
        )}
        id={inputId}
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
export interface SearchFieldProps extends TextFieldProps {
  onClear?: () => void;
  showClearButton?: boolean;
}

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
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            onClick={handleClear}
            size="sm"
            type="button"
            variant="ghost"
          >
            ✕
          </IconButton>
        ) : (
          <Typography className="text-[var(--muted-foreground)]" variant="body2">
            🔍
          </Typography>
        )
      }
      value={internalValue}
    />
  );
}
