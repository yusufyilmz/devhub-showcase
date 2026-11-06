"use client";

import { cn } from "cn";
import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../layout/collapsible";
import { CardBase } from "../card/CardBase";
import type { TextRevealCardProps } from "./types";

export function TextRevealCard({ text, revealText, className, children }: TextRevealCardProps) {
  return (
    <CardBase
      asChild
      className={cn("w-full max-w-sm", className)}
      interaction="static"
      layout="plain"
    >
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            className="group h-auto w-full justify-between gap-3 whitespace-normal px-5 py-4 text-left"
            variant="ghost"
          >
            {text}
            <ChevronDown
              aria-hidden="true"
              className="motion-safe:transition-transform group-data-[state=open]:rotate-180"
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ui-disclosure-motion">
          <div className="mx-5 space-y-2 border-border border-t py-4 text-muted-foreground text-sm">
            <p>{revealText}</p>
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardBase>
  );
}
