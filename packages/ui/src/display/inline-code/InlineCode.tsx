/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */

import { inlineCodeStyles } from "./styles";
import type { InlineCodeOptions } from "./types";

export function InlineCode({ children }: InlineCodeOptions) {
  return <code className={inlineCodeStyles.element1}>{children}</code>;
}
