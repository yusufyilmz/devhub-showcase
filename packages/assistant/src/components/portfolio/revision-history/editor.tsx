"use client";
import { useEffect, useState } from "react";

import { Button } from "@shared/ui/button";
import { SelectField } from "@shared/ui/forms";

import { ProposalComparison } from "../proposal-comparison";
import type { HistoryList, HistoryRead, RevisionHistoryProps } from "./types";
export function RevisionHistory({ profile, revision, load, read, onChange }: RevisionHistoryProps) {
  const [list, setList] = useState<HistoryList | null>(null);
  const [selected, setSelected] = useState("");
  const [review, setReview] = useState<{ snapshot: HistoryRead; baseline: string } | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let cancelled = false;
    load()
      .then((value) => {
        if (!cancelled) setList(value);
      })
      .catch(() => {
        if (!cancelled) setError("Saved revision history is unavailable. Your draft is unchanged.");
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);
  const stale = Boolean(
    review &&
      (review.snapshot.currentRevision !== revision || review.baseline !== JSON.stringify(profile)),
  );
  async function inspect() {
    setBusy(true);
    setError("");
    setNotice("");
    setReview(null);
    const baseline = JSON.stringify(profile);
    try {
      const snapshot = await read(Number(selected));
      setReview({ baseline, snapshot });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This revision cannot be restored.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="Saved revision history" className="editor-card editor-fields">
      <h2>Saved revision history</h2>
      <p>
        Inspect earlier saved work, then restore it into your draft for review. Restoring does not
        save or publish it.
      </p>
      {list && (
        <p>
          Up to {list.retention.count} saved revisions from the last {list.retention.days} days are
          available. Current saved revision: {list.currentRevision}.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <fieldset disabled={busy}>
        <legend>Choose saved work</legend>
        <SelectField
          label="Saved revision"
          onChange={(value) => {
            setSelected(value);
            setReview(null);
            setNotice("");
          }}
          value={selected}
        >
          <option value="">Choose a revision</option>
          {list?.revisions.map((item) => (
            <option key={item.revision} value={String(item.revision)}>
              Revision {item.revision} · {item.created_at}
            </option>
          ))}
        </SelectField>
        <Button disabled={!selected} onClick={inspect} type="button" variant="outline">
          Inspect revision
        </Button>
      </fieldset>
      {review && (
        <>
          <h3>Review revision {review.snapshot.revision}</h3>
          <ProposalComparison after={review.snapshot.profile} before={profile} />
          {stale && (
            <p role="alert">
              Your draft or saved revision changed. Inspect again against the current draft before
              restoring; reload if another tab saved.
            </p>
          )}
          <Button
            disabled={busy || stale}
            onClick={() => {
              onChange(structuredClone(review.snapshot.profile));
              setReview(null);
              setNotice(
                "Earlier work restored into this draft. Review it before saving or publishing.",
              );
            }}
            type="button"
          >
            Restore reviewed revision to draft
          </Button>
          <Button onClick={() => setReview(null)} type="button" variant="outline">
            Cancel restore
          </Button>
        </>
      )}
    </section>
  );
}
