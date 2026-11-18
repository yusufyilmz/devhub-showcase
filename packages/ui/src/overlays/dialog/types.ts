import type * as React from "react";

import type * as DialogPrimitive from "@radix-ui/react-dialog";

export type DialogSize = "sm" | "md" | "lg";

export type DialogContentOptions = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  portalContainer?: HTMLElement | null;
  size?: DialogSize;
};
