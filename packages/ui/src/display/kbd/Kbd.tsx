/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */

import { kbdStyles } from "./styles";
import type { KbdOptions } from "./types";

export function Kbd({ label, children }: KbdOptions) {
  return <kbd className={kbdStyles.element1}>{label || children}</kbd>;
}
