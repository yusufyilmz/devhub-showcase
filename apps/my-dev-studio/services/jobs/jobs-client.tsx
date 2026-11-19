"use client";

import { useRef, useState } from "react";

import { JobsDashboard } from "@shared/assistant/portfolio";
import { NotificationClient } from "@shared/notifications/client";

type Data = React.ComponentProps<typeof JobsDashboard>["data"];
const endpoint = "/api/jobs";

async function read(response: Response) {
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Job Hunter is unavailable.");
  return body;
}

async function change(command: object) {
  return read(
    await fetch(endpoint, {
      body: JSON.stringify(command),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  );
}

export function JobsClient({
  initial,
  initialTab,
  statuses,
}: {
  initial: Data;
  initialTab: React.ComponentProps<typeof JobsDashboard>["initialTab"];
  statuses: readonly string[];
}) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [importJson, setImportJson] = useState("");
  const [importPreview, setImportPreview] = useState<{
    duplicates: number;
    jobs: { company: string; duplicate: boolean; title: string; url: string }[];
    summary: string;
  } | null>(null);
  const lock = useRef(false);
  const worker = useRef(
    new NotificationClient({
      applicationServerKey: initial.pushPublicKey ?? undefined,
      scope: "/jobs-push/",
      workerUrl: "/jobs-push/worker.js",
    }),
  );

  async function action(task: () => Promise<string>) {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setFeedback("");
    try {
      const message = await task();
      setData(await read(await fetch(endpoint, { cache: "no-store" })));
      setFeedback(message);
      return true;
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Job Hunter is unavailable.");
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  return (
    <>
      <details className="mb-4 rounded-lg border p-4">
        <summary className="cursor-pointer font-medium">Import ChatGPT research report</summary>
        <div className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground">
            Paste a structured JSON report from your ChatGPT job search. Listings are unverified
            research and will appear for review in Discover; no applications are submitted. Do not
            paste private recruiter emails or personal data.
          </p>
          <label className="block text-sm font-medium" htmlFor="chatgpt-job-import">
            ChatGPT report JSON
          </label>
          <textarea
            className="min-h-36 w-full rounded-md border bg-background p-3 font-mono text-sm"
            id="chatgpt-job-import"
            maxLength={20_000}
            onChange={(event) => {
              setImportJson(event.target.value);
              setImportPreview(null);
            }}
            placeholder='{"schemaVersion":1,"report":{...},"jobs":[]}'
            value={importJson}
          />
          <button
            className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
            disabled={busy || !importJson.trim()}
            onClick={() => {
              action(async () => {
                let payload: unknown;
                try {
                  payload = JSON.parse(importJson);
                } catch {
                  throw new Error("Please enter valid JSON.");
                }
                const response = await fetch(
                  `/api/jobs/import-chatgpt${importPreview ? "" : "?preview=1"}`,
                  {
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                  },
                );
                const result = await read(response);
                if (!importPreview) {
                  setImportPreview(result);
                  return `Preview ready: ${result.jobs.length} jobs, ${result.duplicates} duplicates.`;
                }
                setImportJson("");
                setImportPreview(null);
                return `Imported ${result.imported} jobs, skipped ${result.duplicates} duplicates. Review in Discover.`;
              });
            }}
            type="button"
          >
            {busy ? "Processing..." : importPreview ? "Confirm import" : "Preview report"}
          </button>
          {importPreview && (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm">{importPreview.summary}</p>
              <p className="text-sm">Review these unverified candidates before confirming:</p>
              <ul className="list-inside list-disc text-sm">
                {importPreview.jobs.map((job) => (
                  <li key={job.url}>
                    {job.company}: {job.title}
                    {job.duplicate ? " (already imported)" : ""}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Confirm imports without sending applications or notifications.
              </p>
            </div>
          )}
        </div>
      </details>
      <JobsDashboard
        baseCvUrl={`${endpoint}/cv`}
        busy={busy}
        cvUrl={(id) => `${endpoint}/cv?job=${encodeURIComponent(id)}`}
        data={data}
        feedback={feedback}
        initialTab={initialTab}
        push={
          data.pushPublicKey
            ? (enabled) => {
                action(async () => {
                  if (enabled) {
                    const subscription = await worker.current.enablePush();
                    await change({ action: "subscribe", subscription });
                    return "Browser alerts enabled on this device.";
                  }
                  const subscription = await worker.current.subscription();
                  if (subscription)
                    await change({ action: "unsubscribe", endpoint: subscription.endpoint });
                  await worker.current.disablePush();
                  return "Browser alerts disabled on this device.";
                });
              }
            : null
        }
        run={(command) =>
          action(async () => {
            if ("action" in command && command.action === "refresh")
              return "Checked for new alerts.";
            const result = await change(command);
            if (typeof result.url === "string") window.location.assign(result.url);
            return "action" in command && command.action === "draft"
              ? "Draft prepared. Review it in Applications."
              : "Saved.";
          })
        }
        statuses={statuses}
      />
    </>
  );
}
