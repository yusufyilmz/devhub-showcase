"use client";

import type * as React from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "cn";

import { avatarStyles, avatarVariants } from "./styles";
import type { AvatarProps } from "./types";

function Avatar({ className, size, variant, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size, variant }), className)}
      data-slot="avatar"
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn(avatarStyles.avatarImage, className)}
      data-slot="avatar-image"
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(avatarStyles.avatarFallback, className)}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
