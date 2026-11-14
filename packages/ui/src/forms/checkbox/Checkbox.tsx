"use client";

import type * as React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "cn";
import { CheckIcon, MinusIcon } from "lucide-react";

import { checkboxStyles } from "./styles";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn("group/checkbox", checkboxStyles.checkbox, className)}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={checkboxStyles.element1}
        data-slot="checkbox-indicator"
      >
        <CheckIcon
          className={cn(
            checkboxStyles.element2,
            "group-data-[state=indeterminate]/checkbox:hidden",
          )}
        />
        <MinusIcon
          className={cn(
            checkboxStyles.element2,
            "hidden group-data-[state=indeterminate]/checkbox:block",
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
