"use client";

import type * as React from "react";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "cn";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import { Button } from "../../buttons/button";
import { toastStyles } from "./styles";
import type { ToastIconOptions } from "./types";

const toast = ToastPrimitive.createToastManager();

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      className={cn(toastStyles.toastViewport, className)}
      data-slot="toast-viewport"
      {...props}
    />
  );
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      className={cn(
        toastStyles.toast,
        toastStyles.toast2,
        toastStyles.toast3,
        toastStyles.toast4,
        toastStyles.toast5,
        toastStyles.toast6,
        toastStyles.toast7,
        toastStyles.toast8,
        toastStyles.toast9,
        toastStyles.toast10,
        toastStyles.toast11,
        toastStyles.toast12,
        toastStyles.toast13,
        toastStyles.toast14,
        toastStyles.toast15,
        className,
      )}
      data-slot="toast"
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      className={cn(toastStyles.toastContent, className)}
      data-slot="toast-content"
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      className={cn(toastStyles.toastTitle, className)}
      data-slot="toast-title"
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      className={cn(toastStyles.toastDescription, className)}
      data-slot="toast-description"
      {...props}
    />
  );
}

function ToastAction({
  className,
  render = <Button size="sm" variant="outline" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      className={cn(toastStyles.toastAction, className)}
      data-slot="toast-action"
      render={render}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = <Button size="icon-sm" variant="ghost" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      aria-label="Close toast"
      className={cn(toastStyles.toastClose, className)}
      data-slot="toast-close"
      render={render}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ type }: ToastIconOptions) {
  let icon: React.ReactNode = null;

  if (type === "success") {
    icon = <CircleCheckIcon aria-hidden="true" />;
  }

  if (type === "info") {
    icon = <InfoIcon aria-hidden="true" />;
  }

  if (type === "warning") {
    icon = <TriangleAlertIcon aria-hidden="true" />;
  }

  if (type === "error") {
    icon = <OctagonXIcon aria-hidden="true" className={toastStyles.element1} />;
  }

  if (type === "loading") {
    icon = <Loader2Icon aria-hidden="true" className={toastStyles.element2} />;
  }

  if (!icon) {
    return null;
  }

  return (
    <span className={toastStyles.element3} data-slot="toast-icon">
      {icon}
    </span>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className={toastStyles.element4}>
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({ children, toastManager = toast, ...props }: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  createToastManager,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
};
