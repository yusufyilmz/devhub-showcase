import type * as React from "react";

import type * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export type NavigationMenuOptions = React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
};
