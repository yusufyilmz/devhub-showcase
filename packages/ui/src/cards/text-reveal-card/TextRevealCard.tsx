"use client";

import { cn } from "cn";
import { ChevronDown } from "lucide-react";

import { Button } from "../../buttons/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../layout/collapsible";
import { collapsibleMotionClassName } from "../../layout/collapsible/styles";
import { CardBase } from "../card/CardBase";
import { disclosureCardStyles } from "../styles";
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
          <Button className={disclosureCardStyles.trigger} variant="ghost">
            <span className="min-w-0 flex-1 wrap-anywhere">{text}</span>
            <ChevronDown aria-hidden="true" className={disclosureCardStyles.chevron} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className={collapsibleMotionClassName}>
          <div className={cn(disclosureCardStyles.body, "text-muted-foreground")}>
            <p>{revealText}</p>
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardBase>
  );
}
