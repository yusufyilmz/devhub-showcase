"use client";
import "../workflow.css";

import { Button } from "@shared/ui/button";

import type { DraftRecoveryProps } from "./types";

const labels = {
  checking: "Checking for recoverable work…",
  failed: "Draft recovery failed. Keep this tab open and retry.",
  idle: "Draft recovery is ready",
  pending: "Recovery pending…",
  saved: "Recovery saved in this tab",
  saving: "Saving recovery…",
};
export function DraftRecovery({ recovery, disabled = false }: DraftRecoveryProps) {
  return (
    <section
      aria-label="Draft recovery"
      className="draft-recovery my-4 grid min-w-0 gap-3 rounded-xl border border-border bg-card p-3.5 text-card-foreground sm:p-4"
    >
      <div className="draft-recovery-summary grid min-w-0 gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid min-w-0 gap-0.5">
          <strong className="text-sm font-semibold">Draft recovery</strong>
          <p aria-live="polite" className="m-0 text-sm leading-snug text-muted-foreground">
            {labels[recovery.status]}
          </p>
        </div>
        <details className="min-w-0 sm:open:col-span-full">
          <summary className="w-fit cursor-pointer rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            How recovery works
          </summary>
          <p className="mt-2 mb-0 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Autosaved in this browser tab for up to 24 hours. Sign out to clear recovery. Save
            changes is still required to update your portfolio and CV. This is not a backup across
            devices.
          </p>
        </details>
      </div>
      {recovery.status === "failed" && (
        <Button
          className="justify-self-start"
          disabled={disabled}
          onClick={recovery.retry}
          size="sm"
          type="button"
          variant="outline"
        >
          Retry recovery save
        </Button>
      )}
      {recovery.stale && (
        <p
          className="m-0 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm leading-relaxed"
          role="alert"
        >
          A newer saved revision exists. Reload to load it before reconciling your changes. Older
          recovery cannot replace it.
        </p>
      )}
      {recovery.candidate && (
        <div className="grid min-w-0 gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:p-4">
          <p className="m-0 text-sm leading-relaxed text-muted-foreground">
            Unsaved work was found from {new Date(recovery.candidate.at).toLocaleString()}. Restore
            it only after reviewing.
          </p>
          <details>
            <summary className="w-fit cursor-pointer rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              Review recovered work
            </summary>
            <pre className="ai-profile-json mt-2 max-h-64 overflow-auto rounded-md border border-border bg-background p-3 text-xs leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
              {JSON.stringify(recovery.candidate.value, null, 2)}
            </pre>
          </details>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={disabled || recovery.stale}
              onClick={recovery.restore}
              size="sm"
              type="button"
            >
              Restore recovered draft
            </Button>
            <Button
              disabled={disabled}
              onClick={recovery.discard}
              size="sm"
              type="button"
              variant="outline"
            >
              Discard recovery
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
