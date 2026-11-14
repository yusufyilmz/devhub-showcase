import { cn } from "cn";

import { inputStyles } from "../input/styles";
import type { NativeSelectProps } from "../types";

/** Native select semantics, including option groups, multiple selection and form submission. */
export function NativeSelect({ unstyled = false, className, ...props }: NativeSelectProps) {
  return (
    <select
      className={
        unstyled
          ? className
          : cn(
              inputStyles.input,
              inputStyles.input2,
              inputStyles.input3,
              props.multiple || Number(props.size) > 1 ? "h-auto py-xs" : "ps-sm pe-lg",
              className,
            )
      }
      data-slot="native-select"
      {...props}
    />
  );
}
