"use client";

import type * as React from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "cn";

import { progressStyles } from "./styles";

function Progress({
  className,
  max = 100,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const limit = max > 0 ? max : 100;
  const fraction =
    typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= limit
      ? value / limit
      : 0;

  return (
    <ProgressPrimitive.Root
      className={cn(progressStyles.progress, className)}
      data-slot="progress"
      max={max}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressStyles.indicator}
        data-slot="progress-indicator"
        style={{ width: `${fraction * 100}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
