import { cn } from "cn";

import type { HeroBlockProps } from "./types";

export function HeroBlock({
  title,
  headingId,
  headingLevel: Heading = "h2",
  eyebrow,
  description,
  actions,
  notes,
  visual,
  variant = "standard",
  layout,
  className,
  children,
  ...props
}: HeroBlockProps) {
  const landing = variant === "landing";
  const centered = !landing && layout === "hero-centered";
  const cover = !landing && layout === "hero-cover";
  const split = !landing && !layout && Boolean(visual);
  const imageCover = cover && Boolean(visual);
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        landing ? "home-container home-hero" : "grid min-w-0 items-center gap-lg md:gap-xl",
        split && "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
        centered && "justify-items-center text-center",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          landing ? "home-hero-copy" : "grid min-w-0 gap-md",
          centered && "justify-items-center",
          cover &&
            "relative isolate min-h-[20rem] content-end overflow-hidden rounded-xl border border-border/70 bg-linear-to-br from-card to-muted/40 p-lg sm:min-h-[27rem] sm:p-xl",
          imageCover && "text-white",
        )}
      >
        {imageCover && (
          <div className="absolute inset-0 -z-10 [&_.work-media]:h-full [&_img]:h-full [&_img]:w-full [&_img]:rounded-none [&_img]:object-cover">
            {visual}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/15"
            />
          </div>
        )}
        <HeroCopy
          actions={actions}
          description={description}
          eyebrow={eyebrow}
          headingId={headingId}
          headingLevel={Heading}
          imageCover={imageCover}
          landing={landing}
          notes={notes}
          title={title}
        />
      </div>
      {!cover && (centered && visual ? <div className="w-full max-w-3xl">{visual}</div> : visual)}
      {children}
    </section>
  );
}

function HeroCopy({
  actions,
  description,
  eyebrow,
  headingId,
  headingLevel: Heading = "h2",
  imageCover,
  landing,
  notes,
  title,
}: Pick<
  HeroBlockProps,
  "actions" | "description" | "eyebrow" | "headingId" | "headingLevel" | "notes" | "title"
> & {
  imageCover: boolean;
  landing: boolean;
}) {
  return (
    <>
      {eyebrow && (
        <p className={landing ? "home-eyebrow" : "text-sm font-semibold text-primary"}>{eyebrow}</p>
      )}
      <Heading
        className={
          landing
            ? undefined
            : "m-0 max-w-[20ch] text-balance wrap-anywhere text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl"
        }
        id={headingId}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={
            landing
              ? "home-hero-description"
              : cn(
                  "m-0 max-w-[55ch] wrap-anywhere leading-relaxed",
                  imageCover ? "text-white/90" : "text-muted-foreground",
                )
          }
        >
          {description}
        </p>
      )}
      {actions && (
        <div className={landing ? "home-hero-actions" : "flex flex-wrap items-center gap-s"}>
          {actions}
        </div>
      )}
      {notes && (
        <div className={landing ? "home-hero-notes" : "text-sm text-muted-foreground"}>{notes}</div>
      )}
    </>
  );
}
