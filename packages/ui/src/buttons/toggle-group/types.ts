import type * as React from "react";

import type * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";

import type { toggleVariants } from "../toggle/Toggle";

export type ToggleGroupOptions = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>;

export type ToggleGroupItemOptions = React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>;
