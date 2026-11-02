"use client";

import type * as React from "react";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";

import { navigationMenuStyles, navigationMenuTriggerStyle } from "./styles";
import type { NavigationMenuOptions } from "./types";

function NavigationMenu({ className, children, viewport = true, ...props }: NavigationMenuOptions) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn(navigationMenuStyles.navigationMenu, className)}
      data-slot="navigation-menu"
      data-viewport={viewport}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn(navigationMenuStyles.navigationMenuList, className)}
      data-slot="navigation-menu-list"
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      className={cn(navigationMenuStyles.navigationMenuItem, className)}
      data-slot="navigation-menu-item"
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        navigationMenuTriggerStyle(),
        navigationMenuStyles.navigationMenuTrigger,
        className,
      )}
      data-slot="navigation-menu-trigger"
      {...props}
    >
      {children} <ChevronDownIcon aria-hidden="true" className={navigationMenuStyles.element1} />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        navigationMenuStyles.navigationMenuContent,
        navigationMenuStyles.navigationMenuContent2,
        className,
      )}
      data-slot="navigation-menu-content"
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn(navigationMenuStyles.navigationMenuViewport)}>
      <NavigationMenuPrimitive.Viewport
        className={cn(navigationMenuStyles.navigationMenuViewport2, className)}
        data-slot="navigation-menu-viewport"
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(navigationMenuStyles.navigationMenuLink, className)}
      data-slot="navigation-menu-link"
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(navigationMenuStyles.navigationMenuIndicator, className)}
      data-slot="navigation-menu-indicator"
      {...props}
    >
      <div className={navigationMenuStyles.element2} />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
