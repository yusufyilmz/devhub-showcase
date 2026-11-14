"use client";

import { cn } from "cn";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { CardBase } from "../card/CardBase";
import type { CardSpotlightProps } from "./types";

export function CardSpotlight({
  children,
  radius = 220,
  color = "var(--primary)",
  interaction = "static",
  className,
  onPointerMove,
  ...props
}: CardSpotlightProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, ${color}, transparent 75%)`;

  return (
    <CardBase
      {...props}
      className={cn(
        "group/spotlight isolate overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] p-5",
        className,
      )}
      interaction={interaction}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.defaultPrevented || event.pointerType === "touch") return;
        const { left, top } = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - left);
        y.set(event.clientY - top);
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 motion-safe:transition-opacity motion-safe:[@media(pointer:fine)]:group-hover/spotlight:opacity-15"
        style={{ background }}
      />
      {children}
    </CardBase>
  );
}
