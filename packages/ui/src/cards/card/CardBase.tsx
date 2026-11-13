import { Slot } from "@radix-ui/react-slot";
import { cn } from "cn";

import { cardBaseStyles } from "../styles";
import type { BaseCardProps } from "../types";

export function CardBase({
  className,
  asChild = false,
  backdrop,
  surface = "semantic",
  interaction = "lift",
  layout = "stack",
  ...props
}: BaseCardProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        cardBaseStyles.cardBase,
        interaction === "lift" && cardBaseStyles.lift,
        layout === "stack" && cardBaseStyles.cardBase2,
        className,
      )}
      data-backdrop={backdrop}
      data-interaction={interaction}
      data-slot="card"
      data-surface={surface}
      {...props}
    />
  );
}

export type { BaseCardProps } from "../types";
