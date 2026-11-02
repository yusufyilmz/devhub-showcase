"use client";

import "@shared/ui/components.css";

import type { ReactNode } from "react";
import { type ComponentProps, useEffect, useRef, useState } from "react";

import type { PortfolioProfile } from "@shared/config";
import { urls } from "@shared/config/urls";
import { type AiEditProposal, aiEditProposalSchema, applyAiEdit } from "@shared/lib/profiles";
import { useStudioRequest } from "@shared/runtime/studio";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { StudioChatScreen } from "@shared/ui/display";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { ProposalComparison } from "@shared/ui/portfolio";
import { Textarea as LibraryTextarea } from "@shared/ui/textarea";

type Props = {
  profile: PortfolioProfile;
  profileId?: string;
  revision: number;
  managed: boolean;
  onChange: (profile: PortfolioProfile) => void;
  chat?: { editorHref: string; actions?: ReactNode; status?: string; error?: string };
};
type Review = { proposal: AiEditProposal; baseline: string; revision: number };
type Availability = { enabled: boolean; usage: number; limit: number };

function ChatPresentation({
  availability,
  profileId,
  saveError,
  saveStatus,
  error,
  status,
  ...screen
}: Omit<ComponentProps<typeof StudioChatScreen>, "notice" | "disabled"> & {
  availability: Availability | null;
  profileId?: string;
  saveError?: string;
  saveStatus?: string;
}) {
  return (
    <StudioChatScreen
      {...screen}
      disabled={!availability?.enabled || !profileId}
      error={error || saveError}
      notice={<AssistantNotice availability={availability} />}
      status={saveStatus || status}
    />
  );
}

function AssistantNotice({ availability }: { availability: Availability | null }) {
  return (
    <>
      <p>Your draft is sent to OpenAI. Review proposals before applying or saving.</p>
      {availability ? (
        <p>
          {availability.usage} / {availability.limit} attempts used.
          {!availability.enabled && (
            <>
              {" "}
              Pro allowance required. <a href="/admin/billing">Manage subscription</a>.
            </>
          )}
        </p>
      ) : (
        <p>Checking assistant access…</p>
      )}
    </>
  );
}
export function AiAssistantEditor(props: Props) {
  if (props.managed)
    return (
      <Card asChild layout="plain" surface="portfolio">
        <section className="editor-card">
          <h2>Private AI assistant</h2>
          <p>This assistant is available only in your own portfolio workspace.</p>
        </section>
      </Card>
    );
  return <AssistantWorkspace {...props} />;
}
function AssistantWorkspace({ profile, profileId, revision, onChange, chat }: Props) {
  const studioRequest = useStudioRequest();
  const [availability, setAvailability] = useState<{
    enabled: boolean;
    usage: number;
    limit: number;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [error, showError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<{ id: number; role: "user" | "assistant"; text: string }[]>(
    [],
  );
  const [review, setReview] = useState<Review | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [undo, setUndo] = useState<{ before: PortfolioProfile; after: string } | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const pending = sessionStorage.getItem("studio-assistant-pending");
    if (pending) {
      setMessage(pending.slice(0, 4000));
      sessionStorage.removeItem("studio-assistant-pending");
    }
    const request = new AbortController();
    studioRequest(urls.next.studio.assistant(), { signal: request.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        setAvailability(await response.json());
      })
      .catch(() => {
        if (!request.signal.aborted)
          showError("Could not load assistant access. Check your subscription or try later.");
      });
    return () => {
      request.abort();
      controller.current?.abort();
    };
  }, [studioRequest]);
  const current = JSON.stringify(profile);
  const stale = Boolean(review && (review.baseline !== current || review.revision !== revision));
  function recordTurn(role: "user" | "assistant", text: string) {
    if (!chat) return;
    setTurns((previous) => [...previous, { id: previous.length, role, text }]);
    if (role === "user") setMessage("");
  }
  async function generate() {
    if (!profileId || !message.trim() || busy) return;
    setBusy(true);
    showError("");
    setStatus("");
    setReview(null);
    controller.current = new AbortController();
    const baseline = JSON.stringify(profile);
    recordTurn("user", message);
    try {
      const response = await studioRequest(urls.next.studio.assistant(), {
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
      const proposal = proposalForRevision(data, revision);
      applyAiEdit(profile, proposal);
      setReview({ baseline, proposal, revision });
      recordTurn("assistant", proposal.summary);
      setSelected([]);
      setAvailability((previous) =>
        previous ? { ...previous, usage: previous.usage + 1 } : previous,
      );
    } catch (reason) {
      if (!controller.current.signal.aborted)
        showError(reason instanceof Error ? reason.message : "Could not generate a proposal.");
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
      showError(
        "These selected changes cannot be combined. Select related changes together or generate a new proposal.",
      );
    }
  }
  if (chat)
    return (
      <ChatPresentation
        actions={chat.actions}
        availability={availability}
        busy={busy}
        editorHref={chat.editorHref}
        error={error}
        message={message}
        messages={turns}
        onMessageChange={setMessage}
        onReset={() => {
          setTurns([]);
          setReview(null);
          setMessage("");
          showError("");
          setStatus("");
        }}
        onStop={() => controller.current?.abort()}
        onSubmit={generate}
        profileId={profileId}
        review={
          review ? (
            <div className="studio-chat-review">
              <ProposalReview
                apply={apply}
                discard={() => setReview(null)}
                profile={profile}
                review={review}
                selected={selected}
                setSelected={setSelected}
                stale={stale}
              />
            </div>
          ) : undefined
        }
        saveError={chat.error}
        saveStatus={chat.status}
        status={status}
      />
    );
  return (
    <Card asChild layout="plain" surface="portfolio">
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
        <LibraryLabel htmlFor="ai-studio-message" unstyled>
          What would you like to change?
        </LibraryLabel>
        <LibraryTextarea
          disabled={busy}
          id="ai-studio-message"
          maxLength={4000}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          unstyled
          value={message}
        />
        <Button
          className="studio-primary"
          disabled={busy || !availability?.enabled || !message.trim() || !profileId}
          onClick={generate}
          type="button"
        >
          {busy ? "Preparing proposal…" : "Generate proposal"}
        </Button>
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
          <Button
            className="studio-secondary"
            disabled={busy || undo.after !== current}
            onClick={() => {
              onChange(undo.before);
              setUndo(null);
              setStatus("AI changes undone in your draft.");
            }}
            type="button"
            variant="outline"
          >
            Undo AI changes
          </Button>
        )}
      </section>
    </Card>
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
      <p>
        Accept the fields you want. Unchecked fields are rejected and stay unchanged. Applying only
        updates this draft.
      </p>
      <p>
        {selected.length} of {review.proposal.changes.length} fields accepted
      </p>
      <Button
        disabled={stale}
        onClick={() => setSelected(review.proposal.changes.map((change) => change.field))}
        type="button"
        variant="outline"
      >
        Accept all proposed changes
      </Button>
      <Button disabled={stale} onClick={() => setSelected([])} type="button" variant="outline">
        Reject all proposed changes
      </Button>
      {review.proposal.changes.map((change) => (
        <div className="proposal-change" key={change.field}>
          <LibraryLabel unstyled>
            <LibraryInput
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
              unstyled
            />
            {change.field}
          </LibraryLabel>
          <p>{change.reason}</p>
          <ProposalComparison after={JSON.parse(change.value)} before={profile[change.field]} />
        </div>
      ))}
      <Button
        className="studio-primary"
        disabled={stale || selected.length === 0}
        onClick={apply}
        type="button"
      >
        Apply selected changes to draft
      </Button>{" "}
      <Button className="studio-secondary" onClick={discard} type="button" variant="outline">
        Discard proposal
      </Button>
    </section>
  );
}

function proposalForRevision(data: { revision?: number; proposal: unknown }, revision: number) {
  if (data.revision !== revision)
    throw new Error("The proposal revision does not match this draft. Generate a fresh proposal.");
  return aiEditProposalSchema.parse(data.proposal);
}
