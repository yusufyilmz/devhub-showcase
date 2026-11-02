import "../../cards/surfaces.css";

import { cn } from "cn";

import { textareaStyles } from "./styles";
import type { TextareaProps } from "./types";

function Textarea({ className, unstyled = false, ...props }: TextareaProps) {
  return (
    <textarea
      className={unstyled ? className : cn(textareaStyles.textarea, className)}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
