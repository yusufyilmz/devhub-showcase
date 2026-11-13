import { cn } from "cn";
import { Braces, Database, Layers, Terminal, Workflow } from "lucide-react";

import { CardBase } from "../card/CardBase";
import type { AnimatedToolsCardProps } from "./types";

const tools = [Terminal, Braces, Layers, Workflow, Database];

export function AnimatedToolsCard({ title, description, className }: AnimatedToolsCardProps) {
  return (
    <CardBase
      className={cn("group/tools flex w-full max-w-sm flex-col gap-4 p-4", className)}
      interaction="static"
      layout="plain"
    >
      <div
        aria-hidden="true"
        className="flex flex-wrap justify-center gap-2 rounded-lg border border-border bg-muted px-3 py-4"
      >
        {tools.map((Icon, index) => (
          <span
            className="grid size-9 place-items-center rounded-lg border border-border bg-card text-primary motion-safe:transition-transform motion-safe:group-hover/tools:-translate-y-1"
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
