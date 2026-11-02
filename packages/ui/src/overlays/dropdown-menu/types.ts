import type * as React from "react";

import type * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export type DropdownMenuItemOptions = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};

export type DropdownMenuLabelOptions = React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
};

export type DropdownMenuSubTriggerOptions = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};
