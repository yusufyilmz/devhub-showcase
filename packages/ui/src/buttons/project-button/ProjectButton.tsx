import Link from "next/link";

import { Button } from "../button";
import type { ProjectButtonOptions } from "../buttons/types";

export function ProjectButton({ title, dark }: ProjectButtonOptions) {
  return (
    <Button
      asChild
      className={
        dark
          ? "h-auto px-5 py-2.5"
          : "h-auto border-primary/30 bg-primary/10 px-5 py-2.5 hover:bg-primary/20"
      }
      variant={dark ? "default" : "outline"}
    >
      <Link href="#projects">{title}</Link>
    </Button>
  );
}
