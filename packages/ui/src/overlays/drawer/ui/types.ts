import type React from "react";

import type * as DrawerPrimitive from "@radix-ui/react-dialog";

export type DrawerProps = {
  open: boolean;
  onClose?: () => void;
  anchor?: "left" | "right" | "top" | "bottom";
  className?: string;
  children: React.ReactNode;
};

export type DrawerContentOptions = React.ComponentProps<typeof DrawerPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
};
