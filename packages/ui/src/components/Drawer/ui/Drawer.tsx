"use client";

import type React from "react";
import { useEffect } from "react";

import * as DrawerPrimitive from "@radix-ui/react-dialog";
import { cn } from "cn";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

export type DrawerProps = {
  open: boolean;
  onClose?: () => void;
  anchor?: "left" | "right" | "top" | "bottom";
  className?: string;
  children: React.ReactNode;
};

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
            className={cn("fixed inset-0 z-40 bg-black/40")}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            animate={{ x: 0, y: 0 }}
            aria-modal="true"
            className={cn(
              "fixed z-50 border border-gray-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900",
              position,
              className,
            )}
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
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
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
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className,
        )}
        data-slot="drawer-content"
        {...props}
      >
        {children}
        <DrawerPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

export function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-4", className)}
      data-slot="drawer-header"
      {...props}
    />
  );
}

export function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
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
      className={cn("text-foreground font-semibold", className)}
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
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}
