/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import type { ReactNode } from "react";

const variants: Record<string, string> = {
  brand: "border-main-green/40 bg-main-green/15 text-main-green",
  danger: "border-red-500/40 bg-red-500/15 text-red-300",
  info: "border-sky-500/40 bg-sky-500/15 text-sky-200",
  neutral: "border-main-lightest bg-backgroundColor-lightestNavy text-textColor-secondary",
  success: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  warning: "border-amber-400/40 bg-amber-400/15 text-amber-200",
};
const sizes = { l: "px-3 py-1.5 text-sm", m: "px-2 py-1 text-xs", s: "px-1.5 py-0.5 text-xs" };

export function Tag({
  variant = "neutral",
  size = "m",
  label,
  children,
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  label?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border ${variants[variant]} ${sizes[size]}`}
    >
      {label || children}
    </span>
  );
}
