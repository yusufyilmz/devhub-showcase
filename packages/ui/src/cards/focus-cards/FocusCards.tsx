import { cn } from "cn";

import { CardBase } from "../card/CardBase";
import type { FocusCardsProps } from "./types";

export function FocusCards({ cards, className }: FocusCardsProps) {
  return (
    <ul
      className={cn(
        "group/focus-cards grid min-w-0 grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {cards.map((card) => (
        <li
          className="min-w-0 motion-safe:transition-opacity motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-has-[li:hover]/focus-cards:not-hover:opacity-75"
          key={card.src}
        >
          <CardBase
            className="overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)]"
            interaction="static"
            layout="plain"
          >
            <figure>
              {/* biome-ignore lint/performance/noImgElement: This component supports arbitrary caller-supplied images. */}
              <img
                alt={card.alt ?? ""}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                src={card.src}
              />
              <figcaption className="border-t border-border/60 px-md py-sm text-sm font-medium wrap-anywhere">
                {card.title}
              </figcaption>
            </figure>
          </CardBase>
        </li>
      ))}
    </ul>
  );
}
