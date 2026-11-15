"use client";
import { useEffect, useState } from "react";

import { Button } from "@shared/ui/button";
import { TextField } from "@shared/ui/text-field";

import { scheduledInstant } from "./schedule-time";
import { publicationStyles } from "./styles";
import type { PublicationScheduleProps, PublicationScheduleRecord } from "./types";

export function PublicationSchedule({
  revision,
  reviewing,
  blocked,
  scheduling,
  onScheduled,
}: PublicationScheduleProps) {
  const [records, setRecords] = useState<PublicationScheduleRecord[]>([]);
  const [local, setLocal] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    let active = true;
    scheduling
      .load()
      .then((value) => {
        if (active) {
          setRecords(value);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setError("Could not read schedule status. Refresh before scheduling.");
      });
    return () => {
      active = false;
    };
  }, [scheduling]);
  async function refresh() {
    setRecords(await scheduling.load());
    setReady(true);
  }
  async function change(id?: string) {
    setBusy(true);
    setError("");
    try {
      if (id) await scheduling.cancel(id);
      else {
        const instant = scheduledInstant(local);
        if (!instant) throw new Error("Choose a valid local date and time.");
        await scheduling.create(instant, timezone, revision);
        onScheduled();
        setLocal("");
      }
      await refresh();
    } catch (reason) {
      setReady(false);
      setError(
        reason instanceof Error
          ? reason.message
          : "Schedule could not be verified. Refresh before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }
  const instant = scheduledInstant(local);
  return (
    <div className={publicationStyles.schedule}>
      <h3>Scheduled publication</h3>
      <p>
        Only the saved revision you review is scheduled. Later draft edits stay private. Immediate
        publication or withdrawal cancels pending schedules.
      </p>
      {error && <p role="alert">{error}</p>}
      <Button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            await refresh();
          } catch {
            setReady(false);
            setError("Could not read schedule status.");
          } finally {
            setBusy(false);
          }
        }}
        type="button"
        variant="outline"
      >
        Refresh schedule status
      </Button>
      {records.map((job) => (
        <div key={job.id}>
          <p>
            Revision {job.revision} · /{job.username} · {job.state}
          </p>
          <p>
            {new Date(job.run_at).toISOString()} · {job.timezone}
          </p>
          {job.error && <p>{job.error}</p>}
          {job.state === "pending" && (
            <Button disabled={busy} onClick={() => change(job.id)} type="button" variant="outline">
              Cancel scheduled publication
            </Button>
          )}
        </div>
      ))}
      {reviewing ? (
        <div>
          <TextField
            label={`Publish date and time (${timezone})`}
            onChange={(event) => setLocal(event.target.value)}
            type="datetime-local"
            value={local}
          />
          <p>
            {instant
              ? `Publish saved revision ${revision} at ${instant} (${timezone}).`
              : "Choose a date at least one minute ahead, within the next year."}
          </p>
          <p>
            The time above is the exact UTC instant. Check it carefully when clocks change.
            Execution may be delayed until the next scheduler run.
          </p>
          <Button
            disabled={blocked || busy || !ready || !instant}
            onClick={() => change()}
            type="button"
          >
            Confirm scheduled publication
          </Button>
        </div>
      ) : (
        <p>
          Use Review publication to review both snapshots and schedule a saved revision. Failed
          schedules can be replaced after reviewing again.
        </p>
      )}
    </div>
  );
}
