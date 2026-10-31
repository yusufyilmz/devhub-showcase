"use client";
import { useEffect, useRef, useState } from "react";

import type { PortfolioProfile } from "@shared/content";
import { type AiEditProposal, aiEditProposalSchema, applyAiEdit } from "@shared/lib/ai-edit";

type Props = {
  profile: PortfolioProfile;
  profileId?: string;
  revision: number;
  managed: boolean;
  onChange: (profile: PortfolioProfile) => void;
};
type Review = { proposal: AiEditProposal; baseline: string; revision: number };
export function AiAssistantEditor(props: Props) {
  if (props.managed)
    return (
      <section className="editor-card">
        <h2>Private AI assistant</h2>
        <p>This assistant is available only in your own portfolio workspace.</p>
      </section>
    );
  return <AssistantWorkspace {...props} />;
}
function AssistantWorkspace({ profile, profileId, revision, onChange }: Props) {
  const [availability, setAvailability] = useState<{
    enabled: boolean;
    usage: number;
    limit: number;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [undo, setUndo] = useState<{ before: PortfolioProfile; after: string } | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const request = new AbortController();
    fetch("/api/admin/assistant", { signal: request.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        setAvailability(await response.json());
      })
      .catch(() => {
        if (!request.signal.aborted)
          setError("Could not load assistant access. Check your subscription or try later.");
      });
    return () => {
      request.abort();
      controller.current?.abort();
    };
  }, []);
  const current = JSON.stringify(profile);
  const stale = Boolean(review && (review.baseline !== current || review.revision !== revision));
  async function generate() {
    if (!profileId || !message.trim() || busy) return;
    setBusy(true);
    setError("");
    setStatus("");
    setReview(null);
    controller.current = new AbortController();
    const baseline = JSON.stringify(profile);
    try {
      const response = await fetch("/api/admin/assistant", {
        body: JSON.stringify({
          draft: profile,
          message,
          profileId,
          requestId: crypto.randomUUID(),
          revision,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.current.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const proposal = aiEditProposalSchema.parse(data.proposal);
      applyAiEdit(profile, proposal);
      setReview({ baseline, proposal, revision });
      setSelected(proposal.changes.map((change) => change.field));
      setAvailability((previous) =>
        previous ? { ...previous, usage: previous.usage + 1 } : previous,
      );
    } catch (reason) {
      if (!controller.current.signal.aborted)
        setError(reason instanceof Error ? reason.message : "Could not generate a proposal.");
    } finally {
      setBusy(false);
    }
  }
  function apply() {
    if (!review || stale) return;
    try {
      const result = applyAiEdit(profile, review.proposal, selected);
      setUndo({ after: JSON.stringify(result), before: structuredClone(profile) });
      onChange(result);
      setReview(null);
      setStatus("Applied to your draft. Review your edits, then use Save changes when ready.");
    } catch {
      setError(
        "These selected changes cannot be combined. Select related changes together or generate a new proposal.",
      );
    }
  }
  return (
    <section className="editor-card">
      <h2>Private AI assistant</h2>
      <p>
        Describe how to create or improve your portfolio. Your current draft, including private
        content, is sent to OpenAI. Avoid including secrets. AI can make mistakes; verify every
        proposed change.
      </p>
      <p>
        Proposals never save automatically. Applying changes updates this draft only. Saving a
        published portfolio updates its public page, so review visibility and content first.
      </p>
      {availability && (
        <p>
          Studio assistant attempts: {availability.usage} / {availability.limit} this billing
          period. Failed or uncertain requests also count.
        </p>
      )}
      {availability && !availability.enabled && (
        <p>
          An active Pro subscription assigned to this portfolio, with remaining allowance, is
          required. <a href="/admin/billing">Manage subscription and assignment</a>.
        </p>
      )}
      <label htmlFor="ai-studio-message">What would you like to change?</label>
      <textarea
        disabled={busy}
        id="ai-studio-message"
        maxLength={4000}
        onChange={(event) => setMessage(event.target.value)}
        rows={4}
        value={message}
      />
      <button
        className="studio-primary"
        disabled={busy || !availability?.enabled || !message.trim() || !profileId}
        onClick={generate}
        type="button"
      >
        {busy ? "Preparing proposal…" : "Generate proposal"}
      </button>
      {busy && <p role="status">Reviewing your draft…</p>}
      {error && <p role="alert">{error}</p>}
      {status && <p role="status">{status}</p>}
      {review && (
        <ProposalReview
          apply={apply}
          discard={() => setReview(null)}
          profile={profile}
          review={review}
          selected={selected}
          setSelected={setSelected}
          stale={stale}
        />
      )}
      {undo && (
        <button
          className="studio-secondary"
          disabled={busy || undo.after !== current}
          onClick={() => {
            onChange(undo.before);
            setUndo(null);
            setStatus("AI changes undone in your draft.");
          }}
          type="button"
        >
          Undo AI changes
        </button>
      )}
    </section>
  );
}
function ProposalReview({
  review,
  selected,
  setSelected,
  stale,
  profile,
  apply,
  discard,
}: {
  review: Review;
  selected: string[];
  setSelected: (selected: string[]) => void;
  stale: boolean;
  profile: PortfolioProfile;
  apply: () => void;
  discard: () => void;
}) {
  return (
    <section>
      <h3>Review proposed changes</h3>
      <p>{review.proposal.summary}</p>
      {stale && (
        <p role="alert">
          Your draft or saved revision changed. Generate a fresh proposal before applying.
        </p>
      )}
      {review.proposal.changes.map((change) => (
        <div key={change.field}>
          <label>
            <input
              checked={selected.includes(change.field)}
              disabled={stale}
              onChange={(event) =>
                setSelected(
                  event.target.checked
                    ? [...selected, change.field]
                    : selected.filter((field) => field !== change.field),
                )
              }
              type="checkbox"
            />
            {change.field}
          </label>
          <p>{change.reason}</p>
          <details>
            <summary>Compare before and after</summary>
            <p>Before</p>
            <pre className="ai-profile-json">{JSON.stringify(profile[change.field], null, 2)}</pre>
            <p>Proposed</p>
            <pre className="ai-profile-json">
              {JSON.stringify(JSON.parse(change.value), null, 2)}
            </pre>
          </details>
        </div>
      ))}
      <button
        className="studio-primary"
        disabled={stale || selected.length === 0}
        onClick={apply}
        type="button"
      >
        Apply selected changes to draft
      </button>{" "}
      <button className="studio-secondary" onClick={discard} type="button">
        Discard proposal
      </button>
    </section>
  );
}
