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
          if ("action" in command && command.action === "refresh") return "Checked for new alerts.";
          const result = await change(command);
          if (typeof result.url === "string") window.location.assign(result.url);
          return "action" in command && command.action === "draft"
            ? "Draft prepared. Review it in Applications."
            : "Saved.";
        })
      }
      statuses={statuses}
    />
  );
}
