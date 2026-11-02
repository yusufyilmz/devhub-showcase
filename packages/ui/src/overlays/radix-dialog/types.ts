import type * as React from "react";

import type * as DialogPrimitive from "@radix-ui/react-dialog";

export type DialogContentOptions = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};
