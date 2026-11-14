"use client";

import { cn } from "cn";
import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../layout/collapsible";
import { CardBase } from "../card/CardBase";
import { disclosureCardStyles } from "../styles";
import type { ExpandableCardsProps } from "./types";

export function ExpandableCards({ cards, className }: ExpandableCardsProps) {
  return (
    <ul className={cn("grid min-w-0 grid-cols-1 gap-2", className)}>
      {cards.map((card) => (
        <li className="min-w-0" key={card.id}>
          <CardBase asChild interaction="static" layout="plain">
            <Collapsible>
              <h3 className="rounded-[inherit]">
                <CollapsibleTrigger asChild>
                  <Button
                    aria-label={`View ${card.title}`}
                    className={disclosureCardStyles.trigger}
                    variant="ghost"
                  >
                    {card.thumbnail && (
                      // biome-ignore lint/performance/noImgElement: Cards accept portable image sources.
                      <img
                        alt=""
                        className="size-10 shrink-0 rounded-md object-cover"
                        src={card.thumbnail}
                      />
                    )}
                    <span className="min-w-0 flex-1 font-medium wrap-anywhere">{card.title}</span>
                    <ChevronDown aria-hidden="true" className={disclosureCardStyles.chevron} />
                  </Button>
                </CollapsibleTrigger>
              </h3>
              <CollapsibleContent className={disclosureCardStyles.content}>
                <div className={disclosureCardStyles.body}>
                  {card.description && <p className="font-medium">{card.description}</p>}
                  <div className="text-muted-foreground">{card.content}</div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardBase>
        </li>
      ))}
    </ul>
  );
}
