"use client";

import { cn } from "cn";
import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../layout/collapsible";
import { CardBase } from "../card/CardBase";
import type { ExpandableCardsProps } from "./types";

export function ExpandableCards({ cards, className }: ExpandableCardsProps) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {cards.map((card) => (
        <li key={card.id}>
          <CardBase asChild interaction="static" layout="plain">
            <Collapsible>
              <h3>
                <CollapsibleTrigger asChild>
                  <Button
                    aria-label={`View ${card.title}`}
                    className="group h-auto w-full justify-start gap-3 whitespace-normal p-4 text-left"
                    variant="ghost"
                  >
                    {card.thumbnail && (
                      // biome-ignore lint/performance/noImgElement: Cards accept portable image sources.
                      <img
                        alt=""
                        className="size-12 rounded-md object-cover"
                        src={card.thumbnail}
                      />
                    )}
                    <span className="flex-1 font-semibold">{card.title}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className="motion-safe:transition-transform group-data-[state=open]:rotate-180"
                    />
                  </Button>
                </CollapsibleTrigger>
              </h3>
              <CollapsibleContent className="ui-disclosure-motion">
                <div className="mx-4 space-y-2 border-border border-t py-4 text-sm">
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
