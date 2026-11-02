/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */

import { bannerClassName } from "./styles";
import type { BannerOptions } from "./types";

export function Banner({ children, className = "" }: BannerOptions) {
  return <div className={bannerClassName(className)}>{children}</div>;
}
