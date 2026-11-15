"use client";

import { Button } from "../../buttons/button";
import { cardActionsStyles } from "../styles";
import type { CardActionsProps } from "../types";

export function CardActions({ actions }: CardActionsProps) {
  return (
    <div className={cardActionsStyles.element1}>
      {actions.map((action) => (
        <Button
          aria-label="Card actions"
          className={cardActionsStyles.element2}
          key={action.label}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
