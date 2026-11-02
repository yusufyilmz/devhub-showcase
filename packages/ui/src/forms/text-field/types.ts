import type React from "react";

import type { VariantProps } from "class-variance-authority";

import type { Input } from "../input";
import type { textFieldVariants } from "./styles";

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

export interface SearchFieldProps extends TextFieldProps {
  onClear?: () => void;
  showClearButton?: boolean;
}

export type FieldLabelOptions = {
  className?: string;
  htmlFor: string;
  label?: string;
  required?: boolean;
};

export type FieldMessageOptions = {
  className?: string;
  errorId: string;
  helperId: string;
  state?: "default" | "error" | "success" | "warning" | null;
  text?: string;
};

export type FieldStateOptions = "default" | "error" | "success" | "warning" | null;
