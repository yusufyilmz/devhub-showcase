"use client";

import type * as React from "react";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "cn";

import { labelStyles } from "./styles";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(labelStyles.label, className)}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
