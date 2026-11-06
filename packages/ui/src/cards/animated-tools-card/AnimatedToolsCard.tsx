import { cn } from "cn";
import { Braces, Database, Layers, Terminal, Workflow } from "lucide-react";

import { CardBase } from "../card/CardBase";
import type { AnimatedToolsCardProps } from "./types";

const tools = [Terminal, Braces, Layers, Workflow, Database];

export function AnimatedToolsCard({ title, description, className }: AnimatedToolsCardProps) {
  return (
    <CardBase
      className={cn("group/tools w-full max-w-sm gap-4 p-5", className)}
      interaction="static"
    >
      <div
        aria-hidden="true"
        className="flex flex-wrap justify-center gap-2 rounded-lg bg-muted p-4"
      >
        {tools.map((Icon, index) => (
          <span
            className="grid size-9 place-items-center rounded-full bg-background text-primary shadow-sm motion-safe:transition-transform motion-safe:group-hover/tools:-translate-y-1"
            key={Icon.displayName}
            style={{ transitionDelay: `${index * 40}ms` }}
          >
            <Icon size={18} />
          </span>
        ))}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
    </CardBase>
  );
}
