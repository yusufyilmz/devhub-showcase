import Link from "next/link";

import { cn } from "cn";
import { ArrowUpRight } from "lucide-react";

import { Button } from "../button";
import type { ProjectButtonOptions } from "../buttons/types";

export function ProjectButton({ title, dark }: ProjectButtonOptions) {
  return (
    <Button
      asChild
      className={cn(
        "h-auto min-h-10 max-w-full px-md py-xs text-center whitespace-normal",
        !dark &&
          "border-primary/25 bg-primary/8 text-foreground hover:border-primary/45 hover:bg-primary/15",
      )}
      variant={dark ? "default" : "outline"}
    >
      <Link href="#projects">
        {title}
        <ArrowUpRight aria-hidden="true" />
      </Link>
    </Button>
  );
}
