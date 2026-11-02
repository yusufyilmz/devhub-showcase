"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "cn";

import { toggleVariants } from "./styles";
import type { ToggleOptions } from "./types";

function Toggle({ className, variant, size, ...props }: ToggleOptions) {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
