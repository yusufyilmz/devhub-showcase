import { Button } from "@shared/ui/button";

import { type SetupPosition, sections } from "./steps";

export function SetupActions({
  busy,
  cvApplied,
  error,
  go,
  onCancel,
  onSave,
  position,
  ready,
  stale,
}: {
  busy: boolean;
  cvApplied: boolean;
  error: string;
  go: (stage: number, section?: number) => void;
  onCancel?: () => void;
  onSave: () => void;
  position: SetupPosition;
  ready: boolean;
  stale: boolean;
}) {
  const { stage, section } = position;
  function back() {
    if (stage === 3 && section > 0) go(3, section - 1);
    else if (stage === 4) go(3, section);
    else go(stage - 1);
  }

  function next() {
    if (stage === 3 && section < sections.length - 1) go(3, section + 1);
    else go(stage + 1, section);
  }

  return (
    <footer className="portfolio-setup-actions">
      {error && (
        <p className="portfolio-setup-error editor-alert" role="alert">
          {error}
        </p>
      )}
      <Button disabled={busy || stage === 0} onClick={back} type="button" variant="outline">
        Back
      </Button>
      {onCancel && (
        <Button disabled={busy} onClick={onCancel} type="button" variant="ghost">
          Cancel starting over
        </Button>
      )}
      <div>
        {stage === 2 && !cvApplied && (
          <Button disabled={busy} onClick={() => go(3)} type="button" variant="ghost">
            Skip for now
          </Button>
        )}
        {stage === 3 && section > 0 && (
          <Button disabled={busy} onClick={next} type="button" variant="ghost">
            Skip for now
          </Button>
        )}
        {stage === 3 && ready && section < sections.length - 1 && (
          <Button disabled={busy} onClick={() => go(4, section)} type="button" variant="outline">
            Review draft
          </Button>
        )}
        {stage < 4 && (stage !== 2 || cvApplied) && (
          <Button disabled={busy || (stage === 3 && !ready)} onClick={next} type="button">
            {nextLabel(stage, section)}
          </Button>
        )}
        {stage === 4 && (
          <Button disabled={busy || stale || !ready} onClick={onSave} type="button">
            {busy ? "Saving…" : "Save private draft"}
          </Button>
        )}
      </div>
    </footer>
  );
}

function nextLabel(stage: number, section: number) {
  if (stage === 0) return "Choose a layout";
  if (stage === 1) return "Continue to CV import";
  if (stage === 2) return "Continue to details";
  return section === sections.length - 1 ? "Review draft" : "Continue";
}
