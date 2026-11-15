"use client";

import { type PointerEvent, useState } from "react";

import { useReducedMotion } from "framer-motion";

import { TooltipHint } from "../tooltip/Tooltip";
import type { AnimatedTooltipProps } from "./types";

export function AnimatedTooltip({
  content,
  children,
  followCursor = false,
  placement = "top",
  offset = 8,
  arrow = true,
  ...props
}: AnimatedTooltipProps) {
  const [alignOffset, setAlignOffset] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const trackPointer = followCursor && !reducedMotion;

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = placement === "top" || placement === "bottom";
    const rtl = horizontal && getComputedStyle(event.currentTarget).direction === "rtl";
    const delta = horizontal
      ? rtl
        ? bounds.right - event.clientX
        : event.clientX - bounds.left
      : event.clientY - bounds.top;
    setAlignOffset(Math.round(delta));
  }

  return (
    <TooltipHint
      align={trackPointer && alignOffset !== null ? "start" : "center"}
      alignOffset={trackPointer ? (alignOffset ?? 0) : 0}
      arrow={arrow && !trackPointer}
      placement={placement}
      sideOffset={offset}
      title={content}
      triggerProps={
        trackPointer
          ? {
              onPointerLeave: () => setAlignOffset(null),
              onPointerMove: handlePointerMove,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </TooltipHint>
  );
}
