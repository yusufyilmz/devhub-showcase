/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function ScrollToTop({ children, offset = 300 }: { children?: ReactNode; offset?: number }) {
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
      className={`fixed right-4 bottom-4 z-40 rounded-full bg-button-primary px-4 py-3 text-sm text-button-light shadow-lg transition ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      {children ?? "Top"}
    </button>
  );
}
