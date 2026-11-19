import { cn } from "cn";

import type { SectionHeadingLevel, SectionHeadingProps } from "./types";

const headingTags: Record<SectionHeadingLevel, "h1" | "h2" | "h3"> = {
  1: "h1",
  2: "h2",
  3: "h3",
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  level,
  className,
}: SectionHeadingProps) {
  const HeadingTag = headingTags[level];
  return (
    <div className={cn("section-frame-heading grid gap-s", className)}>
      {eyebrow ? (
        <p className="eyebrow m-0 text-sm font-medium tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <div className="grid gap-sm">
        <HeadingTag className="m-0 text-balance font-semibold tracking-tight" id={id}>
          {title}
        </HeadingTag>
        {description ? (
          <p className="m-0 max-w-prose text-pretty text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
