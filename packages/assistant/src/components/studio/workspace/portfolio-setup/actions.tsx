import { Button } from "@shared/ui/button";

import { type SetupPosition, sections } from "./steps";

export function SetupActions({
  busy,
  cvApplied,
  error,
  go,
  onSave,
  position,
  ready,
  stale,
}: {
  busy: boolean;
  cvApplied: boolean;
  error: string;
  go: (stage: number, section?: number) => void;
  onSave: () => void;
  position: SetupPosition;
  ready: boolean;
  stale: boolean;
}) {
  const { stage, section } = position;
  function back() {
    if (stage === 2 && section > 0) go(2, section - 1);
    else if (stage === 3) go(2, section);
    else go(stage - 1);
  }

  function next() {
    if (stage === 2 && section < sections.length - 1) go(2, section + 1);
    else go(stage + 1, section);
  }

  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card p-6 max-[767px]:pb-[max(1rem,env(safe-area-inset-bottom))]">
      {error && (
        <p
          className="editor-alert mb-6 rounded-[10px] border border-border px-5 py-4 text-xs leading-[1.8] whitespace-pre-line text-destructive [&_button]:mt-2.5 [&_button]:underline basis-full"
          role="alert"
        >
          {error}
        </p>
      )}
      <Button disabled={busy || stage === 0} onClick={back} type="button" variant="outline">
        Back
      </Button>
      <div className="ms-auto flex flex-wrap items-center justify-end gap-2">
        {stage === 1 && !cvApplied && (
          <Button disabled={busy} onClick={() => go(2)} type="button" variant="ghost">
            Skip for now
          </Button>
        )}
        {stage === 2 && section > 0 && (
          <Button disabled={busy} onClick={next} type="button" variant="ghost">
            Skip for now
          </Button>
        )}
        {stage === 2 && ready && section < sections.length - 1 && (
          <Button disabled={busy} onClick={() => go(3, section)} type="button" variant="outline">
            Review draft
          </Button>
        )}
        {stage < 3 && (stage !== 1 || cvApplied) && (
          <Button disabled={busy || (stage === 2 && !ready)} onClick={next} type="button">
            {nextLabel(stage, section)}
          </Button>
        )}
        {stage === 3 && (
          <Button disabled={busy || stale || !ready} onClick={onSave} type="button">
            {busy ? "Saving…" : "Save private draft"}
          </Button>
        )}
      </div>
    </footer>
  );
}

function nextLabel(stage: number, section: number) {
  if (stage === 0) return "Continue to CV import";
  if (stage === 1) return "Continue to details";
  return section === sections.length - 1 ? "Review draft" : "Continue";
}
