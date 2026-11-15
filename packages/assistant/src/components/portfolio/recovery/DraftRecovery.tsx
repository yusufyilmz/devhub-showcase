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
      className="draft-recovery [min-width:0] [padding:12px_16px] [margin-block:16px] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:12px]"
    >
      <div className="draft-recovery-summary [display:flex] [flex-wrap:wrap] [gap:8px_16px] [align-items:baseline] [&_strong]:[font-size:14px] [&_p]:[margin:0] [font-size:12px] [line-height:1.6] [color:var(--muted-foreground)] [&_details]:[margin:0] [&_details]:[margin-left:auto] [&_details[open]]:[flex-basis:100%]">
        <strong>Draft recovery</strong>
        <p aria-live="polite">{labels[recovery.status]}</p>
        <details>
          <summary>How recovery works</summary>
          <p>
            Autosaved in this browser tab for up to 24 hours. Sign out to clear recovery. Save
            changes is still required to update your portfolio and CV. This is not a backup across
            devices.
          </p>
        </details>
      </div>
      {recovery.status === "failed" && (
        <Button disabled={disabled} onClick={recovery.retry} type="button" variant="outline">
          Retry recovery save
        </Button>
      )}
      {recovery.stale && (
        <p role="alert">
          A newer saved revision exists. Reload to load it before reconciling your changes. Older
          recovery cannot replace it.
        </p>
      )}
      {recovery.candidate && (
        <div>
          <p>
            Unsaved work was found from {new Date(recovery.candidate.at).toLocaleString()}. Restore
            it only after reviewing.
          </p>
          <details>
            <summary>Review recovered work</summary>
            <pre className="ai-profile-json [max-height:34rem] [padding:1rem] [overflow:auto] [font-size:0.8rem] [overflow-wrap:anywhere] [white-space:pre-wrap]">
              {JSON.stringify(recovery.candidate.value, null, 2)}
            </pre>
          </details>
          <Button
            disabled={disabled || recovery.stale}
            onClick={recovery.restore}
            type="button"
            variant="outline"
          >
            Restore recovered draft
          </Button>
          <Button disabled={disabled} onClick={recovery.discard} type="button" variant="outline">
            Discard recovery
          </Button>
        </div>
      )}
    </section>
  );
}
