import type { ReactNode } from "react";

import { Card } from "@shared/ui/cards";

export function StudioHeading({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card asChild layout="plain" withAccent withHover={false}>
      <header className="mb-[var(--studio-heading-gap,clamp(1.25rem,4vw,2rem))] rounded-2xl border border-border bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_11%,transparent),transparent_62%),var(--card)] shadow-[0_4px_20px_color-mix(in_srgb,var(--foreground)_6%,transparent)] [&_h1_span]:text-primary">
        <div className="flex flex-col items-stretch gap-5 p-[clamp(1.125rem,4vw,2.25rem)]">
          <div>
            <p className="font-mono text-[11px] leading-[1.6] font-medium tracking-[0.15em] text-primary uppercase">
              {eyebrow}
            </p>
            <h1 className="my-1.5 text-[clamp(1.875rem,5vw,3.125rem)] leading-[1.06] font-[670] tracking-[-0.055em]">
              {title}
            </h1>
            <p className="max-w-[46ch] text-[0.9375rem] leading-[1.55] text-muted-foreground">
              {description}
            </p>
          </div>

          {actions && (
            <div className="flex flex-wrap items-center justify-between gap-2.5 max-[767px]:w-full max-[767px]:[&>*]:flex-1 max-[767px]:[&>*]:px-3 max-[767px]:[&>*]:py-2.5 max-[767px]:[&>*]:text-[11px]">
              {actions}
            </div>
          )}
        </div>

        {children}
      </header>
    </Card>
  );
}
