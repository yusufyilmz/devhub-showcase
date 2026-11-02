"use client";

import type * as React from "react";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "cn";

import { switchStyles } from "./styles";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(switchStyles.switch, className)}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb className={cn(switchStyles.switch2)} data-slot="switch-thumb" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
