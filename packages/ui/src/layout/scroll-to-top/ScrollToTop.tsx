/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import { useEffect, useState } from "react";

import { scrollToTopClassName } from "./styles";
import type { ScrollToTopOptions } from "./types";

export function ScrollToTop({ children, offset = 300 }: ScrollToTopOptions) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return (
    <button
      aria-hidden={!visible}
      className={scrollToTopClassName(visible ? "opacity-100" : "pointer-events-none opacity-0")}
      onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      {children ?? "Top"}
    </button>
  );
}
