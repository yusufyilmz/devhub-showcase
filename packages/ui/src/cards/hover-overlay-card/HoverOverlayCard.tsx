import { cn } from "cn";

import { CardBase } from "../card/CardBase";
import type { HoverOverlayCardProps } from "./types";

export function HoverOverlayCard({
  title,
  description,
  image,
  hoverImage,
  className,
}: HoverOverlayCardProps) {
  return (
    <CardBase
      asChild
      className={cn(
        "group/image isolate min-h-64 max-w-sm justify-end overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] p-md",
        className,
      )}
      interaction="static"
    >
      <article>
        {/* biome-ignore lint/performance/noImgElement: Backgrounds come from the caller. */}
        <img alt="" className="absolute inset-0 -z-20 size-full object-cover" src={image} />
        {/* biome-ignore lint/performance/noImgElement: The alternate background is decorative. */}
        <img
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover opacity-0 motion-safe:transition-opacity [@media(hover:hover)_and_(pointer:fine)]:group-hover/image:opacity-100"
          src={hoverImage}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-black/95 via-black/65 to-transparent"
        />
        <div className="text-white wrap-anywhere">
          <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-white/90">{description}</p>
          )}
        </div>
      </article>
    </CardBase>
  );
}
