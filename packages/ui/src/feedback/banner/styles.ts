import { cn } from "cn";

export function bannerClassName(className?: string) {
  return cn(
    "flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm leading-relaxed font-medium wrap-anywhere text-card-foreground",
    className,
  );
}
