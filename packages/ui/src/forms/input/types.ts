import type * as React from "react";

export interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  unstyled?: boolean;
}
