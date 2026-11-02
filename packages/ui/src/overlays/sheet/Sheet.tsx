"use client";

import type * as React from "react";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "cn";
import { XIcon } from "lucide-react";

import { sheetStyles } from "./styles";
import type { SheetContentOptions } from "./types";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn(sheetStyles.sheetOverlay, className)}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

function SheetContent({ className, children, side = "right", ...props }: SheetContentOptions) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          sheetStyles.sheetContent,
          side === "right" && sheetStyles.sheetContent2,
          side === "left" && sheetStyles.sheetContent3,
          side === "top" && sheetStyles.sheetContent4,
          side === "bottom" && sheetStyles.sheetContent5,
          className,
        )}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        <SheetPrimitive.Close className={sheetStyles.element1}>
          <XIcon className={sheetStyles.element2} />
          <span className={sheetStyles.element3}>Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(sheetStyles.sheetHeader, className)} data-slot="sheet-header" {...props} />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(sheetStyles.sheetFooter, className)} data-slot="sheet-footer" {...props} />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn(sheetStyles.sheetTitle, className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn(sheetStyles.sheetDescription, className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
