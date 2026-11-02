"use client";

import type * as React from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "cn";
import { CircleIcon } from "lucide-react";

import { radioGroupStyles } from "./styles";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn(radioGroupStyles.radioGroup, className)}
      data-slot="radio-group"
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(radioGroupStyles.radioGroupItem, className)}
      data-slot="radio-group-item"
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={radioGroupStyles.element1}
        data-slot="radio-group-indicator"
      >
        <CircleIcon className={radioGroupStyles.element2} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
