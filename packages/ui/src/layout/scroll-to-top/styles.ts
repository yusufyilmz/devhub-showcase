import { cn } from "cn";

export function scrollToTopClassName(visibility: string): string {
  return cn(
    "fixed end-md bottom-[max(var(--spacing-md),env(safe-area-inset-bottom))] z-40 h-10 rounded-full border-border/75 bg-background/95 px-sm shadow-sm motion-safe:transition-opacity",
    visibility,
  );
}
