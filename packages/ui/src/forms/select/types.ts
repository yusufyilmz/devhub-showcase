import type * as React from "react";

import type * as SelectPrimitive from "@radix-ui/react-select";

export type SelectTriggerOptions = React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
};
