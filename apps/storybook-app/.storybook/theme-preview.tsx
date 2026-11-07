import { type ReactNode, useLayoutEffect } from "react";

import { NotificationProvider, StudioRequestProvider } from "@shared/ui/providers";

type ThemeGlobals = Record<string, unknown>;

/** Root attributes also theme Radix portals mounted outside the story canvas. */
export function ThemePreview({
  globals,
  children,
  fullBleed = false,
}: {
  globals: ThemeGlobals;
  children: ReactNode;
  fullBleed?: boolean;
}) {
  const brand = String(globals.brand ?? "white");
  const mode = globals.mode === "dark" ? "dark" : "light";
  const radius = String(globals.radius ?? "base");
  const spacing = String(globals.spacing ?? "comfortable");
  useLayoutEffect(() => {
    const root = document.documentElement;
    const attributes = {
      "data-brand": brand,
      "data-radius": radius,
      "data-spacing": spacing,
      "data-theme": mode,
    };
    const previous = Object.fromEntries(
      Object.keys(attributes).map((key) => [key, root.getAttribute(key)]),
    );
    const dark = root.classList.contains("dark");
    for (const [key, value] of Object.entries(attributes)) root.setAttribute(key, value);
    root.classList.toggle("dark", mode === "dark");
    return () => {
      for (const [key, value] of Object.entries(previous)) {
        if (value === null) root.removeAttribute(key);
        else root.setAttribute(key, value);
      }
      root.classList.toggle("dark", dark);
    };
  }, [brand, mode, radius, spacing]);
  return (
    <div
      className={
        fullBleed
          ? "min-h-screen bg-background text-foreground"
          : "min-h-screen bg-background p-lg text-foreground"
      }
      data-brand={brand}
      data-radius={radius}
      data-spacing={spacing}
      data-theme={mode}
    >
      <NotificationProvider>
        <StudioRequestProvider request={async () => Response.json({ ok: true })}>
          {children}
        </StudioRequestProvider>
      </NotificationProvider>
    </div>
  );
}
