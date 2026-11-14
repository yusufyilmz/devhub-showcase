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
            className="group h-auto min-h-11 w-full justify-between gap-3 whitespace-normal px-md py-3 text-left text-foreground aria-expanded:bg-muted/60"
            variant="ghost"
          >
            {text}
            <ChevronDown
              aria-hidden="true"
              className="motion-safe:transition-transform group-data-[state=open]:rotate-180"
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ui-disclosure-motion [overflow:clip] motion-safe:[&[data-state='open']]:[animation:ui-disclosure-open_340ms_cubic-bezier(0.22,_1,_0.36,_1)] motion-safe:[&[data-state='closed']]:[animation:ui-disclosure-close_240ms_ease-in]">
          <div className="mx-md space-y-2 border-t border-border py-4 text-sm leading-relaxed text-muted-foreground">
            <p>{revealText}</p>
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardBase>
  );
}
