import "../../cards/surfaces.css";

import type * as React from "react";

import { cn } from "cn";

import { textareaStyles } from "./styles";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea className={cn(textareaStyles.textarea, className)} data-slot="textarea" {...props} />
  );
}

export { Textarea };
