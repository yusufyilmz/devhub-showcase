import { isValidElement, type ReactNode } from "react";

import { cn } from "cn";

import type { SectionFrameProps } from "./types";

/** Direct-child prose rhythm. Do not target every descendant paragraph. */
export const sectionFrameProseClassName = "grid gap-sm [&>p]:m-0";

function labelledBy(heading: ReactNode) {
  if (!isValidElement(heading)) return undefined;
  const id = (heading.props as { id?: unknown }).id;
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

export function SectionFrame({
  id,
  heading,
  children,
  context = "standalone",
  surface = "plain",
  width = "contained",
  className,
  labelledBy: labelledById,
  sectionType,
  layout,
}: SectionFrameProps) {
  const band = width === "bleed" && surface !== "card";
  return (
    <section
      aria-labelledby={labelledById ?? labelledBy(heading)}
      className={cn(
        "section-frame my-0 grid min-w-0",
        heading ? "gap-lg @min-[64rem]:gap-xl" : undefined,
        width === "reading" && "mx-auto w-full max-w-prose",
        width === "bleed" && "w-full",
        band && "px-md py-(--spacing-2xl) @min-[64rem]:px-xl @min-[64rem]:py-(--spacing-3xl)",
        surface === "muted" && "bg-muted",
        surface === "card" && "rounded-xl border border-border bg-card p-md @min-[64rem]:p-lg",
        className,
      )}
      data-section-context={context}
      data-section-layout={layout}
      data-section-surface={surface}
      data-section-type={sectionType}
      data-section-width={width}
      id={id}
    >
      {heading}
      <div className="section-content min-w-0">{children}</div>
    </section>
  );
}
