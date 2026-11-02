import type * as React from "react";

import type * as TogglePrimitive from "@radix-ui/react-toggle";
import type { VariantProps } from "class-variance-authority";

import type { toggleVariants } from "./styles";

export type ToggleOptions = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>;
