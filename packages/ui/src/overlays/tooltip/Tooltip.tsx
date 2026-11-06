"use client";

import "./tooltip.css";

import { type ComponentProps, createContext, Fragment, isValidElement, useContext } from "react";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "cn";

import { tooltipContentClass } from "./styles";
import type { TooltipContentProps, TooltipProps, TooltipRootProps } from "./types";

const HasTooltipProvider = createContext(false);

function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <HasTooltipProvider.Provider value>
      <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
    </HasTooltipProvider.Provider>
  );
}

function TooltipRoot(props: TooltipRootProps) {
  const hasProvider = useContext(HasTooltipProvider);
  const root = <TooltipPrimitive.Root {...props} />;
  return hasProvider ? root : <TooltipProvider>{root}</TooltipProvider>;
}

function TooltipTrigger(props: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  arrow = true,
  children,
  className,
  sideOffset = 4,
  variant,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(tooltipContentClass({ variant }), className)}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        {children}
        {arrow && <TooltipPrimitive.Arrow className="fill-(--tooltip-bg)" />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

function Tooltip({ ...props }: TooltipProps | (TooltipRootProps & { title?: never })) {
  if ("title" in props) {
    return <TooltipHint {...(props as TooltipProps)} />;
  }

  return <TooltipRoot {...props} />;
}

function TooltipHint({
  arrow,
  children,
  className,
  contentClassName,
  delay,
  disabled,
  placement,
  title,
  triggerProps,
  variant,
  ...contentProps
}: TooltipProps &
  Pick<TooltipContentProps, "sideOffset" | "alignOffset"> & {
    triggerProps?: Pick<ComponentProps<typeof TooltipTrigger>, "onPointerLeave" | "onPointerMove">;
  }) {
  if (disabled || title === null || title === undefined || title === false || title === "") {
    return <>{children}</>;
  }

  return (
    <TooltipRoot delayDuration={delay}>
      <TooltipTrigger asChild className={className} {...triggerProps}>
        {isValidElement(children) && children.type !== Fragment ? (
          children
        ) : (
          // biome-ignore lint/a11y/noNoninteractiveTabindex: Text-only triggers need a focus target for the hint.
          <span tabIndex={0}>{children}</span>
        )}
      </TooltipTrigger>
      <TooltipContent
        arrow={arrow}
        className={contentClassName}
        side={placement}
        variant={variant}
        {...contentProps}
      >
        {title}
      </TooltipContent>
    </TooltipRoot>
  );
}

export { Tooltip, TooltipContent, TooltipHint, TooltipProvider, TooltipTrigger };
