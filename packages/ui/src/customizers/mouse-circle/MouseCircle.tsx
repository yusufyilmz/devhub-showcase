"use client";

import { useEffect, useRef } from "react";

import { mouseCircleStyles } from "./styles";

export function MouseCircle() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = glow.current;
    if (!node) return;

    const motion = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const hide = () => {
      node.style.opacity = "0";
    };
    const move = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== "mouse") return;
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      node.style.opacity = "1";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    motion.addEventListener("change", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      motion.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={mouseCircleStyles.element1}
      data-slot="mouse-circle"
      ref={glow}
    />
  );
}
