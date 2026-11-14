"use client";

import type * as React from "react";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cn } from "cn";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { contextMenuStyles } from "./styles";
import type {
  ContextMenuItemOptions,
  ContextMenuLabelOptions,
  ContextMenuSubTriggerOptions,
} from "./types";

function ContextMenu({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
  onKeyDown,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        const opensMenu = event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
        if (event.defaultPrevented || props.disabled || !opensMenu) return;

        const trigger = event.currentTarget;
        const { left, bottom } = trigger.getBoundingClientRect();
        event.preventDefault();
        trigger.dispatchEvent(
          new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            clientX: left,
            clientY: bottom,
          }),
        );
      }}
      {...props}
    />
  );
}

function ContextMenuGroup({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuPortal({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuSub({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerOptions) {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(contextMenuStyles.contextMenuSubTrigger, className)}
      data-inset={inset}
      data-slot="context-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className={contextMenuStyles.element1} />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(contextMenuStyles.contextMenuSubContent, className)}
      data-slot="context-menu-sub-content"
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(contextMenuStyles.contextMenuContent, className)}
        data-slot="context-menu-content"
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuItemOptions) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(contextMenuStyles.contextMenuItem, className)}
      data-inset={inset}
      data-slot="context-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(contextMenuStyles.contextMenuCheckboxItem, className)}
      data-slot="context-menu-checkbox-item"
      {...props}
    >
      <span className={contextMenuStyles.element2}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className={contextMenuStyles.element3} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(contextMenuStyles.contextMenuRadioItem, className)}
      data-slot="context-menu-radio-item"
      {...props}
    >
      <span className={contextMenuStyles.element4}>
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className={contextMenuStyles.element5} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({ className, inset, ...props }: ContextMenuLabelOptions) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(contextMenuStyles.contextMenuLabel, className)}
      data-inset={inset}
      data-slot="context-menu-label"
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn(contextMenuStyles.contextMenuSeparator, className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(contextMenuStyles.contextMenuShortcut, className)}
      data-slot="context-menu-shortcut"
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
