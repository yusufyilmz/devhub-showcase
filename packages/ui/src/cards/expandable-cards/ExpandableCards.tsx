"use client";

import { cn } from "cn";
import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../layout/collapsible";
import { CardBase } from "../card/CardBase";
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
                    className="group h-auto min-h-11 w-full justify-start gap-3 rounded-[inherit] px-4 py-3 text-left whitespace-normal text-card-foreground focus-visible:-outline-offset-2 aria-expanded:bg-foreground/5"
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
                    <ChevronDown
                      aria-hidden="true"
                      className="text-muted-foreground motion-safe:transition-transform group-data-[state=open]:rotate-180"
                    />
                  </Button>
                </CollapsibleTrigger>
              </h3>
              <CollapsibleContent className="ui-disclosure-motion [overflow:clip] motion-safe:[&[data-state='open']]:[animation:ui-disclosure-open_340ms_cubic-bezier(0.22,_1,_0.36,_1)] motion-safe:[&[data-state='closed']]:[animation:ui-disclosure-close_240ms_ease-in]">
                <div className="mx-4 space-y-1.5 border-border border-t pt-3 pb-4 text-sm wrap-anywhere">
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
