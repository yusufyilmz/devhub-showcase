/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */

import { cn } from "cn";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";

import { Button } from "../../buttons/button";
import { variants } from "./styles";
import type { FeedbackOptions } from "./types";

const icons = { danger: CircleX, info: Info, success: CircleCheck, warning: TriangleAlert };

export function Feedback({
  variant = "info",
  title,
  description,
  children,
  onClose,
}: FeedbackOptions) {
  const StatusIcon = icons[variant];

  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-start gap-sm rounded-xl border border-(--feedback-tone)/25 bg-(--feedback-tone)/5 p-sm text-foreground",
        variants[variant],
      )}
      role="alert"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--feedback-tone)/12 text-(--feedback-tone)">
        <StatusIcon aria-hidden="true" className="size-4" />
      </span>
      <div className="grid min-w-0 flex-1 gap-xs py-1 text-sm leading-snug wrap-anywhere">
        {title ? <p className="font-semibold">{title}</p> : null}
        {description ? (
          <p className="leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        {children}
      </div>
      {onClose ? (
        <Button
          aria-label="Dismiss"
          className="text-muted-foreground"
          onClick={onClose}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
