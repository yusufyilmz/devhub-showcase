import { cn } from "cn";

import { Button } from "./Button";
import type { ButtonOptions } from "./types";

export const studioButtonClass = {
  primary:
    "inline-flex min-h-[46px] items-center justify-center gap-[18px] rounded-[9px] border border-primary bg-primary px-5 py-3 text-[13px] font-semibold text-background no-underline shadow-[0_5px_24px_color-mix(in_srgb,var(--primary)_12%,transparent)] transition-[transform,border-color,box-shadow] duration-150 enabled:hover:-translate-y-px enabled:hover:shadow-[0_5px_24px_color-mix(in_srgb,var(--primary)_10%,transparent)]",
  secondary:
    "inline-flex min-h-[46px] items-center justify-center gap-[18px] rounded-[9px] border border-border bg-card px-5 py-3 text-[13px] font-semibold text-foreground no-underline transition-[transform,border-color,box-shadow] duration-150 enabled:hover:-translate-y-px enabled:hover:shadow-[0_5px_24px_color-mix(in_srgb,var(--primary)_10%,transparent)]",
} as const;

export function StudioButton({
  tone = "primary",
  className,
  variant: _variant,
  ...props
}: ButtonOptions & { tone?: keyof typeof studioButtonClass }) {
  return (
    <Button
      className={cn(studioButtonClass[tone], className)}
      data-studio-button={tone}
      variant="unstyled"
      {...props}
    />
  );
}
