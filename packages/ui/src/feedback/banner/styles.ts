import { cn } from "cn";

export function bannerClassName(className?: string) {
  return cn(
    "flex w-full min-w-0 flex-wrap items-center justify-center gap-x-sm gap-y-s rounded-xl border border-border bg-card px-md py-s text-center text-sm leading-relaxed font-medium wrap-anywhere text-card-foreground",
    className,
  );
}
