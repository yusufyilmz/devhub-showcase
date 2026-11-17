"use client";

import { type FormEvent, useId } from "react";

import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";

import type { CalendarItem, TaskDraft } from "./model";

export interface TaskFormProps {
  busy: boolean;
  date: string;
  onCancel: () => void;
  onSubmit: (draft: TaskDraft) => void;
  task?: CalendarItem;
}

export function TaskForm({ date, task, busy, onCancel, onSubmit }: TaskFormProps) {
  const id = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !event.currentTarget.reportValidity()) return;

    const data = new FormData(event.currentTarget);
    onSubmit({
      completed: data.has("completed"),
      date: String(data.get("date")),
      description: String(data.get("description")).trim(),
      time: String(data.get("time")) || null,
      title: String(data.get("title")).trim(),
    });
  }

  return (
    <form
      aria-busy={busy}
      className="grid gap-4"
      key={`${date}:${task?.id ?? ""}`}
      onSubmit={submit}
    >
      <fieldset className="grid min-w-0 gap-4" disabled={busy}>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-title`}>Title</Label>
          <Input
            defaultValue={task?.title}
            id={`${id}-title`}
            maxLength={160}
            name="title"
            pattern={".*\\S.*"}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-description`}>Description</Label>
          <Textarea
            defaultValue={task?.description}
            id={`${id}-description`}
            maxLength={2000}
            name="description"
            rows={3}
          />
        </div>
        <ScheduleFields date={task?.date ?? date} time={task?.time} timeLabel="Time (optional)" />
        <div className="flex items-center gap-2">
          <Input
            className="size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed"
            defaultChecked={task?.completed}
            id={`${id}-completed`}
            name="completed"
            type="checkbox"
            unstyled
          />
          <Label htmlFor={`${id}-completed`}>Completed</Label>
        </div>
      </fieldset>
      <div className="flex flex-wrap justify-end gap-2">
        <Button disabled={busy} onClick={onCancel} type="button" variant="outline">
          Cancel
        </Button>
        <Button disabled={busy} type="submit">
          {busy ? "Saving…" : task ? "Save changes" : "Add task"}
        </Button>
      </div>
    </form>
  );
}

export function ScheduleFields({
  date,
  time,
  disabled,
  timeLabel = "Time",
}: {
  date: string;
  time?: string;
  disabled?: boolean;
  timeLabel?: string;
}) {
  const id = useId();
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="grid min-w-0 gap-2">
        <Label htmlFor={`${id}-date`}>Date</Label>
        <Input
          defaultValue={date}
          disabled={disabled}
          id={`${id}-date`}
          name="date"
          required
          type="date"
        />
      </div>
      <div className="grid min-w-0 gap-2">
        <Label htmlFor={`${id}-time`}>{timeLabel}</Label>
        <Input defaultValue={time} disabled={disabled} id={`${id}-time`} name="time" type="time" />
      </div>
    </div>
  );
}
