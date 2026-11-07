"use client";
import "../../styles/portfolio/publication.css";

import { useEffect, useState } from "react";

import { projectPublicProfile } from "@shared/config";

import { Button } from "../../buttons/button";
import { TextField } from "../../forms/text-field";
import { ProposalComparison } from "../proposal-comparison";
import { PublicationSchedule } from "./schedule";
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
  scheduling,
}: PublicationProps) {
  const [status, setStatus] = useState<PublicationStatus | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(false);
  const [password, setPassword] = useState("");
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
      if (publish && password && profile.publicationVisibility === "password")
        await change(publish, revision, password);
      else await change(publish, revision);
      setPassword("");
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
      <p>{publicationMessage(status)}</p>
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
            applies the saved access policy to both snapshots.
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
          {profile.publicationVisibility === "password" && (
            <TextField
              autoComplete="new-password"
              helperText="Use 12–128 characters. Leave blank to keep the current password if one is set. Republishing ends previous visitor sessions."
              label="Publication password"
              maxLength={128}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          )}
          <Button
            disabled={blocked || (password.length > 0 && password.length < 12)}
            onClick={() => update(true)}
            type="button"
          >
            Confirm publication
          </Button>
          <Button
            disabled={busy}
            onClick={() => {
              setReview(false);
              setPassword("");
            }}
            type="button"
            variant="outline"
          >
            Cancel publication
          </Button>
        </div>
      )}
      {scheduling && profile.publicationVisibility !== "password" && (
        <PublicationSchedule
          blocked={blocked}
          key={`${revision}-${status?.published?.updated_at ?? "private"}`}
          onScheduled={() => setReview(false)}
          reviewing={review}
          revision={revision}
          scheduling={scheduling}
        />
      )}
      {status?.published && (
        <Button disabled={blocked} onClick={() => update(false)} type="button" variant="outline">
          Withdraw public website and CV
        </Button>
      )}
    </div>
  );
}

function publicationMessage(status: PublicationStatus | null) {
  if (status?.published)
    return `Published revision ${status.published.revision}. Saving edits keeps this public version unchanged.`;
  return status
    ? "Your saved draft is private until you publish it."
    : "Checking publication status. Refresh if it is unavailable.";
}
