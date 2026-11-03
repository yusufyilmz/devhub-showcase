"use client";
import "./publication.css";

import { useEffect, useState } from "react";

import { projectPublicProfile } from "@shared/config";

import { Button } from "../../buttons/button";
import { ProposalComparison } from "../proposal-comparison";
import { publicationStyles } from "./styles";
import type { PublicationProps, PublicationStatus } from "./types";

/** Publication is an explicit action against the current saved revision. */
export function PublicationControls({
  revision,
  profile,
  dirty,
  disabled,
  load,
  change,
  onChanged,
}: PublicationProps) {
  const [status, setStatus] = useState<PublicationStatus | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(false);
  useEffect(() => {
    let active = true;
    setStatus(null);
    setReview(false);
    load()
      .then((value) => {
        if (active) setStatus(value);
      })
      .catch(() => {
        if (active) setError("Could not read publication status. Refresh before publishing.");
      });
    return () => {
      active = false;
    };
  }, [load]);
  const stale = status?.currentRevision !== revision;
  async function update(publish: boolean) {
    setBusy(true);
    setError("");
    let changed = false;
    try {
      await change(publish, revision);
      changed = true;
      onChanged(publish);
      setStatus(await load());
      setReview(false);
    } catch (reason) {
      setError(
        changed
          ? "Publication request completed, but status could not be verified. Refresh before trying again."
          : reason instanceof Error
            ? reason.message
            : "Publication failed. Your saved draft is unchanged.",
      );
      setReview(false);
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }
  const blocked = disabled || busy || dirty || !status || stale;
  return (
    <div className={publicationStyles.root}>
      <h3>Public website and CV</h3>
      <p>
        {status?.published
          ? `Published revision ${status.published.revision}. Saving edits keeps this public version unchanged.`
          : status
            ? "Your saved draft is private until you publish it."
            : "Checking publication status. Refresh if it is unavailable."}
      </p>
      {status?.published && (
        <Button
          href={`/${status.published.username}`}
          rel="noopener noreferrer"
          target="_blank"
          variant="outline"
        >
          Open published portfolio ↗
        </Button>
      )}
      <p>
        Website and CV field selections are independent. A detail hidden on the website can still
        appear in the public CV if its CV setting allows it.
      </p>
      {dirty && <p>Save your draft before reviewing publication.</p>}
      {stale && status && <p>The saved revision changed. Reload the editor before publishing.</p>}
      {error && <p role="alert">{error}</p>}
      <Button
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          setReview(false);
          try {
            setStatus(await load());
          } catch {
            setStatus(null);
            setError("Could not read publication status.");
          } finally {
            setBusy(false);
          }
        }}
        type="button"
        variant="outline"
      >
        Refresh publication status
      </Button>
      {!review ? (
        <Button disabled={blocked} onClick={() => setReview(true)} type="button">
          Review publication
        </Button>
      ) : (
        <div>
          <p>
            Publish saved revision {revision}? Only permitted website and CV fields will be copied
            to public snapshots. Review Field visibility and Preview before confirming. Publishing
            makes those snapshots available to anyone with the link.
          </p>
          <details>
            <summary>Review website snapshot changes</summary>
            <ProposalComparison
              after={projectPublicProfile(profile, "website")}
              before={status?.published?.profile ?? null}
            />
          </details>
          <details>
            <summary>Review public CV snapshot changes</summary>
            <ProposalComparison
              after={projectPublicProfile(profile, "cv")}
              before={status?.publishedCv ?? null}
            />
          </details>
          <Button disabled={blocked} onClick={() => update(true)} type="button">
            Confirm publication
          </Button>
          <Button disabled={busy} onClick={() => setReview(false)} type="button" variant="outline">
            Cancel publication
          </Button>
        </div>
      )}
      {status?.published && (
        <Button disabled={blocked} onClick={() => update(false)} type="button" variant="outline">
          Withdraw public website and CV
        </Button>
      )}
    </div>
  );
}
