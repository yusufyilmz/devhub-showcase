import type * as React from "react";

import type * as MenubarPrimitive from "@radix-ui/react-menubar";

export type MenubarItemOptions = React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};

export type MenubarLabelOptions = React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
};

export type MenubarSubTriggerOptions = React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
};
