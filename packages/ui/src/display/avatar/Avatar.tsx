"use client";

import type * as React from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "cn";

import { avatarStyles } from "./styles";

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarStyles.avatar, className)}
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
