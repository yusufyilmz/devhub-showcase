"use client";

import type * as React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "cn";
import { CheckIcon } from "lucide-react";

import { checkboxStyles } from "./styles";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxStyles.checkbox, className)}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={checkboxStyles.element1}
        data-slot="checkbox-indicator"
      >
        <CheckIcon className={checkboxStyles.element2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
