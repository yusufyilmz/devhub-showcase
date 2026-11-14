import { cn } from "cn";
import { Braces, Database, Layers, Terminal, Workflow } from "lucide-react";

import { CardBase } from "../card/CardBase";
import type { AnimatedToolsCardProps } from "./types";

const tools = [Terminal, Braces, Layers, Workflow, Database];

export function AnimatedToolsCard({ title, description, className }: AnimatedToolsCardProps) {
  return (
    <CardBase
      className={cn("group/tools flex w-full max-w-sm flex-col gap-md p-md", className)}
      interaction="static"
      layout="plain"
    >
      <div
        aria-hidden="true"
        className="flex flex-wrap justify-center gap-xs rounded-lg border border-border/60 bg-muted/60 px-sm py-md"
      >
        {tools.map((Icon, index) => (
          <span
            className="grid size-9 place-items-center rounded-md border border-border/60 bg-card text-primary motion-safe:transition-transform motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/tools:-translate-y-1"
            key={Icon.displayName}
            style={{ transitionDelay: `${index * 40}ms` }}
          >
            <Icon size={18} />
          </span>
        ))}
      </div>
      <div className="space-y-1 wrap-anywhere">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
    </CardBase>
  );
}
