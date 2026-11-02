import type * as React from "react";

import type * as SheetPrimitive from "@radix-ui/react-dialog";

export type SheetContentOptions = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
};
