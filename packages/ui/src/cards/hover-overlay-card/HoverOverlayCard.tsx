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
        "group/image relative isolate min-h-64 max-w-sm justify-end overflow-hidden p-5",
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
          className="absolute inset-0 -z-20 size-full object-cover opacity-0 motion-safe:transition-opacity motion-safe:group-hover/image:opacity-100"
          src={hoverImage}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/35 to-transparent"
        />
        <div className="text-white">
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && <p className="mt-1 text-sm">{description}</p>}
        </div>
      </article>
    </CardBase>
  );
}
