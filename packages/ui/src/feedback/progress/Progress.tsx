"use client";

import type * as React from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "cn";

import { progressInlineStyle1, progressStyles } from "./styles";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn(progressStyles.progress, className)}
      data-slot="progress"
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressStyles.element1}
        data-slot="progress-indicator"
        style={progressInlineStyle1(`translateX(-${100 - (value || 0)}%)`)}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
