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
  const [alignOffset, setAlignOffset] = useState(0);
  const reducedMotion = useReducedMotion();
  const trackPointer = followCursor && !reducedMotion;

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const delta =
      placement === "top" || placement === "bottom"
        ? event.clientX - bounds.left - bounds.width / 2
        : event.clientY - bounds.top - bounds.height / 2;
    setAlignOffset(Math.round(delta));
  }

  return (
    <TooltipHint
      alignOffset={trackPointer ? alignOffset : 0}
      arrow={arrow && !trackPointer}
      placement={placement}
      sideOffset={offset}
      title={content}
      triggerProps={
        trackPointer
          ? {
              onPointerLeave: () => setAlignOffset(0),
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
