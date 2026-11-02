import type * as React from "react";

import type * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export type ContextMenuSubTriggerOptions = React.ComponentProps<
  typeof ContextMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};

export type ContextMenuItemOptions = React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};

export type ContextMenuLabelOptions = React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
};
