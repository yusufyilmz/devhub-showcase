import { cn } from "cn";

export function bannerClassName(className?: string) {
  return cn(
    "flex w-full items-center justify-center gap-[0.625rem] rounded-xl border border-border bg-muted/60 px-[1rem] py-[0.625rem] text-center text-sm font-medium text-foreground",
    className,
  );
}
