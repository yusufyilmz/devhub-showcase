import "../../cards/surfaces.css";

import { cn } from "cn";

import { inputStyles } from "./styles";
import type { InputProps } from "./types";

function Input({
  className,
  unstyled = false,
  type,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}: InputProps) {
  return (
    <input
      className={
        unstyled
          ? className
          : cn(inputStyles.input, inputStyles.input2, inputStyles.input3, className)
      }
      data-slot="input"
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      type={type}
      value={value}
      {...props}
    />
  );
}

export type { InputProps } from "./types";
export { Input };
