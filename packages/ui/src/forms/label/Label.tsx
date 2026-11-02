"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "cn";

import { labelStyles } from "./styles";
import type { LabelProps } from "./types";

function Label({ className, unstyled = false, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={unstyled ? className : cn(labelStyles.label, className)}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
