"use client";

import type * as React from "react";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "cn";

import { seperatorStyles } from "./styles";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(seperatorStyles.separator, className)}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
