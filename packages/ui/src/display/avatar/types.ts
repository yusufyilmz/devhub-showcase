import type { ComponentProps } from "react";

import type * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { VariantProps } from "class-variance-authority";

import type { avatarVariants } from "./styles";

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}
