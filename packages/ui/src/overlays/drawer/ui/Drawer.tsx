"use client";

import type React from "react";
import { useEffect } from "react";

import * as DrawerPrimitive from "@radix-ui/react-dialog";
import { cn } from "cn";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

import { drawerStyles } from "./styles";
import type { DrawerContentOptions, DrawerProps } from "./types";

export const Drawer = ({ open, onClose, anchor = "right", className, children }: DrawerProps) => {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const _translateClosed = {
    bottom: "translate-y-full",
    left: "-translate-x-full",
    right: "translate-x-full",
    top: "-translate-y-full",
  }[anchor];

  const position = {
    bottom: "bottom-0 left-0 w-full h-80",
    left: "left-0 top-0 h-full w-80",
    right: "right-0 top-0 h-full w-80",
    top: "top-0 left-0 w-full h-80",
  }[anchor];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className={cn(drawerStyles.drawer)}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            animate={{ x: 0, y: 0 }}
            aria-modal="true"
            className={cn(drawerStyles.drawer2, position, className)}
            exit={{
              x: anchor === "right" ? 300 : anchor === "left" ? -300 : 0,
              y: anchor === "bottom" ? 300 : anchor === "top" ? -300 : 0,
            }}
            initial={{
              x: anchor === "right" ? 300 : anchor === "left" ? -300 : 0,
              y: anchor === "bottom" ? 300 : anchor === "top" ? -300 : 0,
            }}
            role="dialog"
            transition={{ damping: 24, stiffness: 260, type: "spring" }}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

export function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn(drawerStyles.drawerOverlay, className)}
      data-slot="drawer-overlay"
      {...props}
    />
  );
}

export function DrawerContent({
  className,
  children,
  side = "right",
  ...props
}: DrawerContentOptions) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          drawerStyles.drawerContent,
          side === "right" && drawerStyles.drawerContent2,
          side === "left" && drawerStyles.drawerContent3,
          side === "top" && drawerStyles.drawerContent4,
          side === "bottom" && drawerStyles.drawerContent5,
          className,
        )}
        data-slot="drawer-content"
        {...props}
      >
        {children}
        <DrawerPrimitive.Close className={drawerStyles.element1}>
          <XIcon className={drawerStyles.element2} />
          <span className={drawerStyles.element3}>Close</span>
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

export function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(drawerStyles.drawerHeader, className)}
      data-slot="drawer-header"
      {...props}
    />
  );
}

export function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(drawerStyles.drawerFooter, className)}
      data-slot="drawer-footer"
      {...props}
    />
  );
}

export function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn(drawerStyles.drawerTitle, className)}
      data-slot="drawer-title"
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn(drawerStyles.drawerDescription, className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}

export type { DrawerProps } from "./types";
