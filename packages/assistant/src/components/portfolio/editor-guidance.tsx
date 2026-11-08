"use client";
import "./editor-guidance.css";

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
    <div className="editor-guidance">
      <fieldset aria-label="Draft history" className="editor-history">
        <Button disabled={disabled || !canUndo} onClick={undo} type="button" variant="outline">
          Undo draft change
        </Button>
        <Button disabled={disabled || !canRedo} onClick={redo} type="button" variant="outline">
          Redo draft change
        </Button>
        <span>Session history. Saving or discarding starts a new history.</span>
      </fieldset>
      <details className="editor-checklist">
        <summary>
          Portfolio checklist · {items.filter((item) => item.complete).length} of {items.length}{" "}
          complete
        </summary>
        <p>Guidance for your draft. These suggestions do not block saving or publishing.</p>
        <ul>
          {items.map((item) => (
            <li data-complete={item.complete || undefined} key={item.label}>
              <span aria-hidden="true">{item.complete ? "✓" : "○"}</span>
              <div>
                <strong>{item.label}</strong>
                <small>
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
