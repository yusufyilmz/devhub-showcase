import { cn } from "cn";

import { inputStyles } from "../input/styles";
import { textareaStyles } from "./styles";
import type { TextareaProps } from "./types";

function Textarea({ className, unstyled = false, ...props }: TextareaProps) {
  return (
    <textarea
      className={
        unstyled
          ? className
          : cn(textareaStyles.textarea, inputStyles.input2, inputStyles.input3, className)
      }
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
