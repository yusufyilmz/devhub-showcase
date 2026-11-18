"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import type { z } from "zod";

import { type CalendarItem, calendarRange, type TaskDraft } from "@shared/calendar";
import { CalendarGrid } from "@shared/calendar/calendar-grid";
import { AgendaItem, DayAgenda } from "@shared/calendar/day-agenda";
import { TaskForm } from "@shared/calendar/task-form";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";
import { dateKey, dateLabel } from "@shared/utils/date";

import type { CalendarData, StudioTask, taskMutation } from "@/services/calendar/contracts";

type Mutation = z.infer<typeof taskMutation>;
type Filter = "all" | CalendarItem["source"];

const noItems: readonly CalendarItem[] = [];
const googleMessages: Record<string, string> = {
  connected: "Google connected.",
  denied: "Google access was declined. You can connect again any time.",
  disconnected: "Google disconnected.",
  failed: "Google couldn’t connect. Try again and allow access to Calendar and Tasks.",
  removed:
    "Google was disconnected from this browser. You can remove its access in your Google Account.",
};

function subscribeTimeZone() {
  return () => {};
}

function useCalendarData(accountId: string, date: string, timeZone: string) {
  const [version, setVersion] = useState(0);
  const { from, to } = calendarRange(date);
  const query = new URLSearchParams({ from, timeZone, to }).toString();
  const requestKey = `${query}:${version}`;
  const [result, setResult] = useState<{
    key: string;
    query?: string;
    data?: CalendarData;
    error?: string;
  }>();

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/studio/calendar/data?${query}`, {
          cache: "no-store",
          headers: { "x-calendar-account": accountId },
          signal: controller.signal,
        });
        const body = await response.json();
        if (!controller.signal.aborted) {
          setResult(
            response.ok
              ? { data: body, key: requestKey, query }
              : { error: body.error, key: requestKey },
          );
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult({ error: "Couldn’t load your calendar. Try refreshing.", key: requestKey });
        }
      }
    }
    load();
    return () => controller.abort();
  }, [accountId, query, requestKey]);

  return {
    connection: result?.data?.connection,
    data: result?.query === query ? result.data : undefined,
    error: result?.key === requestKey ? result.error : undefined,
    loading: result?.key !== requestKey,
    refresh: () => setVersion((current) => current + 1),
  };
}

function GoogleConnection({
  configured,
  state,
}: {
  configured: boolean;
  state?: CalendarData["connection"];
}) {
  if (!configured) {
    return (
      <span className="text-sm text-muted-foreground">
        Google integration is unavailable on this deployment.
      </span>
    );
  }
  if (!state) return null;
  if (state === "connected") {
    return (
      <form
        action="/studio/calendar/google/disconnect"
        className="flex flex-wrap items-center gap-2"
        method="post"
      >
        <span className="text-sm font-medium text-muted-foreground">Google connected</span>
        <Button size="sm" type="submit" variant="ghost">
          Disconnect Google
        </Button>
      </form>
    );
  }
  return (
    <form action="/studio/calendar/google/connect" method="post">
      <Button size="sm" type="submit" variant="outline">
        {state === "expired" ? "Reconnect Google" : "Connect Google Calendar"}
      </Button>
    </form>
  );
}

export function CalendarWorkspace({
  accountId,
  googleConfigured,
  googleNotice,
  initialDate,
}: {
  accountId: string;
  googleConfigured: boolean;
  googleNotice?: string;
  initialDate: string;
}) {
  const timeZone = useSyncExternalStore(
    subscribeTimeZone,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => "UTC",
  );
  const today = timeZone === "UTC" ? initialDate : dateKey(timeZone);
  const [selectedDate, setSelectedDate] = useState<string>();
  const date = selectedDate ?? today;
  const { connection, data, error, loading, refresh } = useCalendarData(accountId, date, timeZone);
  const [filter, setFilter] = useState<Filter>("all");
  const [editor, setEditor] = useState<{ date: string; task?: StudioTask }>();
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const editTrigger = useRef<HTMLElement | null>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");

  const byDay = useMemo(() => {
    const days = new Map<string, CalendarItem[]>();
    for (const item of [...(data?.tasks ?? []), ...(data?.items ?? [])]) {
      if (filter !== "all" && filter !== item.source) continue;
      const entries = days.get(item.date) ?? [];
      entries.push(item);
      days.set(item.date, entries);
    }
    return days;
  }, [data, filter]);

  function openEditor(task?: StudioTask, day = date) {
    setFailure("");
    editTrigger.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setEditor({ date: task?.date ?? day, task });
  }

  async function mutate(task: Mutation, success: string, targetDate?: string) {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    setFailure("");
    setMessage("");
    try {
      const response = await fetch("/studio/calendar/data", {
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json", "x-calendar-account": accountId },
        method: "POST",
      });
      if (!response.ok) {
        const { error } = await response.json();
        setFailure(error ?? "Couldn’t save the task. Try again.");
        return;
      }
      if (targetDate) setSelectedDate(targetDate);
      if (task.action === "create") setFilter("all");
      setEditor(undefined);
      setMessage(success);
      refresh();
    } catch {
      setFailure("Couldn’t save the task. Try again.");
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  function saveTask(draft: TaskDraft) {
    const task = editor?.task;
    if (task) {
      mutate(
        { action: "update", draft, id: task.id, revision: task.revision },
        "Task updated.",
        draft.date,
      );
    } else {
      mutate({ action: "create", draft }, "Task added.", draft.date);
    }
  }

  function removeTask(task: StudioTask) {
    if (window.confirm(`Delete “${task.title}”?`)) {
      mutate({ action: "delete", id: task.id, revision: task.revision }, "Task deleted.");
    }
  }

  function moveTask(id: string, _from: string, to: string, time?: string) {
    const task = data?.tasks.find((item) => item.id === id);
    if (!task || (task.date === to && task.time === time)) return;
    const draft: TaskDraft = {
      completed: task.completed ?? false,
      date: to,
      description: task.description ?? "",
      time: time ?? null,
      title: task.title,
    };
    mutate({ action: "update", draft, id, revision: task.revision }, "Task moved.", to);
  }

  const notice =
    googleNotice && Object.hasOwn(googleMessages, googleNotice) ? googleMessages[googleNotice] : "";
  const currentItems = byDay.get(date) ?? noItems;

  return (
    <main
      className="studio mx-auto grid w-full max-w-[90rem] gap-5 px-4 py-6 sm:gap-6 sm:px-8 sm:py-9"
      id="admin-content"
    >
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div className="grid gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">My Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Plan your day with Studio tasks, Google events, and Google Tasks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GoogleConnection configured={googleConfigured} state={connection} />
          <Button disabled={busy} onClick={() => openEditor()} ref={addButton} type="button">
            Add task
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label className="flex items-center gap-2 text-sm font-medium" unstyled>
          Show
          <NativeSelect
            aria-label="Calendar source"
            onChange={(event) => setFilter(event.currentTarget.value as Filter)}
            value={filter}
          >
            <option value="all">All sources</option>
            <option value="studio">Studio tasks</option>
            <option value="google-calendar">Google Calendar</option>
            <option value="google-tasks">Google Tasks</option>
          </NativeSelect>
        </Label>
        <Button disabled={loading} onClick={refresh} size="sm" type="button" variant="outline">
          {loading ? "Refreshing…" : "Refresh calendar"}
        </Button>
      </div>
      {(message || notice) && (
        <p className="text-sm text-muted-foreground" role="status">
          {message || notice}
        </p>
      )}
      {(error || Boolean(data?.warnings.length)) && (
        <div
          className="grid gap-1 rounded-lg border border-border bg-card p-3 text-sm text-foreground"
          role="alert"
        >
          {error ? <p>{error}</p> : data?.warnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      )}
      {!editor && <TaskError message={failure} />}
      <TaskEditor
        busy={busy}
        draft={editor}
        failure={failure}
        onClose={() => setEditor(undefined)}
        onDelete={removeTask}
        onRestoreFocus={() =>
          (editTrigger.current?.isConnected ? editTrigger.current : addButton.current)?.focus()
        }
        onSave={saveTask}
      />

      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <CalendarGrid
          canMove={(item) => item.source === "studio" && !item.completed}
          date={date}
          getItems={(day) => byDay.get(day) ?? noItems}
          onAddDay={busy ? undefined : (day) => openEditor(undefined, day)}
          onDateChange={setSelectedDate}
          onMove={busy ? undefined : moveTask}
          today={today}
        />
        <SelectedDay
          busy={busy}
          date={date}
          error={error}
          items={currentItems}
          loading={loading}
          onAdd={() => openEditor()}
          onEdit={openEditor}
          tasks={data?.tasks}
        />
      </div>
    </main>
  );
}

function TaskError({ message }: { message: string }) {
  return message ? (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  ) : null;
}

function TaskEditor({
  busy,
  draft,
  failure,
  onClose,
  onDelete,
  onRestoreFocus,
  onSave,
}: {
  busy: boolean;
  draft?: { date: string; task?: StudioTask };
  failure: string;
  onClose: () => void;
  onDelete: (task: StudioTask) => void;
  onRestoreFocus: () => void;
  onSave: (draft: TaskDraft) => void;
}) {
  const task = draft?.task;
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
      open={Boolean(draft)}
    >
      {draft && (
        <DialogContent
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            onRestoreFocus();
          }}
        >
          <DialogTitle>{task ? "Edit task" : "Add task"}</DialogTitle>
          <TaskError message={failure} />
          <TaskForm
            busy={busy}
            date={draft.date}
            onCancel={onClose}
            onSubmit={onSave}
            task={task}
          />
          {task && (
            <Button
              className="justify-self-start"
              disabled={busy}
              onClick={() => onDelete(task)}
              size="sm"
              type="button"
              variant="destructive"
            >
              Delete task
            </Button>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}

function SelectedDay({
  busy,
  date,
  error,
  items,
  loading,
  onAdd,
  onEdit,
  tasks,
}: {
  busy: boolean;
  date: string;
  error?: string;
  items: readonly CalendarItem[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (task: StudioTask) => void;
  tasks?: StudioTask[];
}) {
  return (
    <Card className="grid min-w-0 gap-4 p-3 sm:p-5" interaction="static" layout="plain">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold">Day agenda</h2>
          <time className="text-sm text-muted-foreground" dateTime={date}>
            {dateLabel(date)}
          </time>
        </div>
        <Button disabled={busy} onClick={onAdd} size="sm" type="button" variant="outline">
          Add task for this day
        </Button>
      </header>
      <DayAgenda
        date={date}
        emptyMessage={
          loading
            ? "Loading items…"
            : error
              ? "Calendar data is unavailable."
              : "No items for this day."
        }
        items={items}
        renderItem={(item) => {
          const task =
            item.source === "studio" && tasks?.find((candidate) => candidate.id === item.id);
          return task ? (
            <div className="grid gap-2">
              <AgendaItem item={item} />
              <Button
                aria-label={`Edit ${task.title}`}
                className="justify-self-start"
                disabled={busy}
                onClick={() => onEdit(task)}
                size="sm"
                type="button"
                variant="outline"
              >
                Edit task
              </Button>
            </div>
          ) : (
            <AgendaItem item={item} />
          );
        }}
      />
    </Card>
  );
}
