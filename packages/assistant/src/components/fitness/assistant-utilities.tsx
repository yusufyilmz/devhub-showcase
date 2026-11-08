"use client";

import { useMemo, useRef, useState } from "react";

import { quantityLabel, WeeklyPlanningService } from "@shared/lib/meal";
import { dateLabel, monday, type Workspace } from "@shared/lib/types";
import type { NotificationMessage } from "@shared/notifications";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

const weekly = new WeeklyPlanningService();

export function ShoppingDraft({
  date,
  onSave,
  onSaved,
  workspace,
}: {
  date: string;
  onSave: (draft: Workspace, label: string) => Promise<boolean>;
  onSaved: () => void;
  workspace: Workspace;
}) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const start = monday(date);
  const draft = useMemo(() => weekly.generate(workspace, start), [start, workspace]);
  const items = draft.tasks.filter(
    (task) => task.parentId === `week:${start}:shopping` && !task.archived,
  );

  async function save() {
    setPending(true);
    setFailed(false);
    if (await onSave(draft, "Weekly shopping and cooking tasks saved")) onSaved();
    else {
      setPending(false);
      setFailed(true);
    }
  }

  return (
    <section aria-label="Shopping list preview" className="fitness-assistant-proposal">
      <h3>Shopping for the week of {dateLabel(start)}</h3>
      <p>
        Calculated from your saved meals and ingredients. Review quantities and ingredient choices
        before buying.
      </p>
      {items.length === 0 && <p>Add ingredients to your weekly meal plan to build a list.</p>}
      <ul>
        {items.map(
          (task) =>
            task.details.type === "shopping" && (
              <li key={task.id}>
                <strong>{task.title}</strong>
                <span>
                  {quantityLabel(
                    task.details.quantityMin,
                    task.details.quantityMax,
                    task.details.unit,
                  )}
                </span>
                {task.details.warnings.length > 0 && <p>{task.details.warnings.join(" ")}</p>}
              </li>
            ),
        )}
      </ul>
      {failed && (
        <p role="alert">The list could not be saved. Check the workspace status and try again.</p>
      )}
      <Button disabled={pending || !items.length} onClick={save} type="button" variant="outline">
        {pending ? "Saving…" : "Save weekly shopping list"}
      </Button>
    </section>
  );
}

export function NotificationNow({
  notify,
}: {
  notify: (message: NotificationMessage) => Promise<boolean>;
}) {
  const [message, setMessage] = useState("Time for your fitness routine.");
  const [status, setStatus] = useState("");
  const pending = useRef(false);
  const [sending, setSending] = useState(false);

  async function send() {
    if (pending.current || !message.trim()) return;
    pending.current = true;
    setSending(true);
    setStatus("");
    try {
      const shown = await notify({
        body: message.trim(),
        id: crypto.randomUUID(),
        title: "My Fitness Studio",
        url: "/?view=Today",
      });
      setStatus(
        shown
          ? "Notification shown on this device."
          : "Allow notifications for Fitness Studio in your device settings first.",
      );
    } catch {
      setStatus("Could not show the notification. Check this device's notification settings.");
    } finally {
      pending.current = false;
      setSending(false);
    }
  }

  return (
    <section aria-label="Send a notification" className="fitness-assistant-proposal">
      <p>
        This notification appears on this device now. Keep the message suitable for your lock
        screen.
      </p>
      <Label unstyled>
        Notification message
        <Input
          disabled={sending}
          maxLength={160}
          onChange={(event) => {
            setMessage(event.target.value);
            setStatus("");
          }}
          unstyled
          value={message}
        />
      </Label>
      <Button disabled={sending || !message.trim()} onClick={send} type="button" variant="outline">
        {sending ? "Sending…" : "Send to this device"}
      </Button>
      <p role="status">{status}</p>
    </section>
  );
}
