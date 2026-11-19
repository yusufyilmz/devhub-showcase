"use client";
import { Button } from "@shared/ui/button";

import { portfolioCompletion } from "./completion";
import type { EditorGuidanceProps } from "./types";

export function EditorGuidance({
  profile,
  onNavigate,
  undo,
  redo,
  canUndo,
  canRedo,
  disabled,
}: EditorGuidanceProps) {
  const items = portfolioCompletion(profile);
  return (
    <div className="mt-4 mb-6 grid gap-3">
      <fieldset
        aria-label="Draft history"
        className="m-0 flex flex-wrap items-center gap-2 border-0 p-0"
      >
        <Button disabled={disabled || !canUndo} onClick={undo} type="button" variant="outline">
          Undo draft change
        </Button>
        <Button disabled={disabled || !canRedo} onClick={redo} type="button" variant="outline">
          Redo draft change
        </Button>
        <span className="text-xs text-muted-foreground">
          Session history. Saving or discarding starts a new history.
        </span>
      </fieldset>
      <details className="rounded-xl border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Portfolio checklist · {items.filter((item) => item.complete).length} of {items.length}{" "}
          complete
        </summary>
        <p className="my-3 text-xs text-muted-foreground">
          Guidance for your draft. These suggestions do not block saving or publishing.
        </p>
        <ul className="m-0 list-none p-0">
          {items.map((item) => (
            <li
              className="flex items-center gap-3 border-t border-border py-3"
              data-complete={item.complete || undefined}
              key={item.label}
            >
              <span aria-hidden="true" className={item.complete ? "text-primary" : undefined}>
                {item.complete ? "✓" : "○"}
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-[13px] font-semibold">{item.label}</strong>
                <small className="block text-xs leading-relaxed text-muted-foreground">
                  {item.essential ? "Essential guidance" : "Recommended"} · {item.reason}
                </small>
              </div>
              <Button
                aria-label={`Edit ${item.label}`}
                disabled={disabled}
                onClick={() => onNavigate(item.tab, item.label)}
                type="button"
                variant="ghost"
              >
                Edit
              </Button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
