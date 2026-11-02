import type { CSSProperties } from "react";

import type { MouseCircleInlineStyle1Values } from "./types";

export const mouseCircleStyles = {
  element1: "w-0 h-0 pointer-events-none shadow-[0_0_100px_50px_rgba(30,144,255,0.4)]",
} as const;

export function mouseCircleInlineStyle1(...values: MouseCircleInlineStyle1Values): CSSProperties {
  return {
    left: values[0],
    position: "fixed",
    top: values[1],
    transform: "translate(-50%, -50%)",
    zIndex: 50,
  };
}
