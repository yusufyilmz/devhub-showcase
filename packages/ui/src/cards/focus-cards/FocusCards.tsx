import { cn } from "cn";

import { CardBase } from "../card/CardBase";
import type { FocusCardsProps } from "./types";

export function FocusCards({ cards, className }: FocusCardsProps) {
  return (
    <ul className={cn("group/focus-cards grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {cards.map((card) => (
        <li
          className="motion-safe:transition-opacity motion-safe:group-hover/focus-cards:[&:not(:hover)]:opacity-65"
          key={card.src}
        >
          <CardBase className="overflow-hidden p-0" interaction="static">
            <figure>
              {/* biome-ignore lint/performance/noImgElement: This component supports arbitrary caller-supplied images. */}
              <img
                alt={card.alt ?? ""}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                src={card.src}
              />
              <figcaption className="px-4 py-3 font-medium">{card.title}</figcaption>
            </figure>
          </CardBase>
        </li>
      ))}
    </ul>
  );
}
