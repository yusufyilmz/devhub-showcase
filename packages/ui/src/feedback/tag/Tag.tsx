/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */

import { sizes, tagClassName, variants } from "./styles";
import type { TagProps } from "./types";

export function Tag({ variant = "neutral", size = "m", label, children }: TagProps) {
  return <span className={tagClassName(variants[variant], sizes[size])}>{label || children}</span>;
}
