"use client";
import { useMemo, useState } from "react";

import {
  type AgendaEvent,
  AgendaService,
  ScheduleService,
  TaskService,
} from "@shared/services/schedule";
import type { Task, Workspace } from "@shared/services/types";
import { dateKey } from "@shared/services/types";

import { useAgendaNavigation } from "@/features/agenda/use-agenda-navigation";
import { TaskEditor, type TaskEditorTarget } from "@/features/task-editor/task-editor";

import { useTaskReminders } from "./use-reminders";
import type { WorkspaceController } from "./use-task-workspace";
import { WorkspaceFrame, WorkspacePanels } from "./workspace-views";

const agendaService = new AgendaService();
const taskService = new TaskService();
const scheduleService = new ScheduleService();
export function TaskWorkspace({ controller }: { controller: WorkspaceController }) {
  const { state, readOnly, busy, update, save, error, setError } = controller;
  const today = dateKey(state.settings.timezone);
  const { tab, date, taskId, setTab, setDate, openDay, openTask } = useAgendaNavigation(today);
  const [target, setTarget] = useState<TaskEditorTarget | null>(null);
  const [templateRoot, setTemplateRoot] = useState<string | null>(null);
  useTaskReminders(state, readOnly);
  const day = useMemo(() => scheduleService.ensureDay(state, date), [state, date]);
  const onEdit = (task: Task) => {
    if (!readOnly) setTarget({ task });
  };
  const onAdd = (parent: Task) => {
    if (!readOnly) setTarget({ parent });
  };
  const treeProps = {
    busy,
    onAdd,
    onEdit,
    onSet: (task: Task, reps: number, weight: number) =>
      update(
        (s) => taskService.logSet(scheduleService.ensureDay(s, date), task.id, reps, weight),
        "Set logged",
      ),
    onStatus: (task: Task, status: Task["status"]) =>
      update(
        (s) =>
          taskService.complete(
            task.scope === "scheduled" ? scheduleService.ensureDay(s, task.date ?? date) : s,
            task.id,
            status,
          ),
        "Task updated",
      ),
    readOnly,
  };
  const selectedTask = activityOnDate(day, taskId, date);
  function onEventStatus(event: AgendaEvent) {
    const snapshot = scheduleService.ensureDay(state, event.date);
    const nodes = [event.task, ...taskService.descendants(snapshot.tasks, event.task.id)];
    if (
      event.status !== "done" &&
      nodes.some(
        (t) =>
          t.details.type === "set" &&
          (t.details.actualReps === null || t.details.weightKg === null),
      )
    ) {
      openTask(event.date, event.task.id);
      setError("Enter reps and weight for each set in the activity details before completing it.");
      return;
    }
    update(
      (s) =>
        taskService.complete(
          event.task.scope === "scheduled" ? scheduleService.ensureDay(s, event.date) : s,
          event.task.id,
          event.status === "done" ? "pending" : "done",
        ),
      "Task updated",
    );
  }
  async function onMove(id: string, from: string, to: string, time: string | null) {
    if (readOnly || busy) return;
    try {
      const next = agendaService.move(state, id, from, to, time);
      if (await save(next, "Activity rescheduled")) if (taskId === id) openTask(to, id);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const editorWorkspace =
    target?.task?.scope === "scheduled" || target?.parent?.scope === "scheduled" ? day : state;
  return (
    <WorkspaceFrame
      busy={busy}
      date={date}
      error={error}
      name={state.settings.name}
      onDismissError={() => setError("")}
      overlay={
        <>
          {target && !readOnly ? (
            <TaskEditor
              busy={busy}
              key={target.task?.id ?? target.parent?.id ?? "new"}
              onClose={() => setTarget(null)}
              onError={setError}
              onSave={save}
              target={target}
              workspace={editorWorkspace}
            />
          ) : null}
          {controller.message ? (
            <div className="toast" role="status">
              {controller.message}
              {controller.undo ? (
                <button disabled={busy} onClick={controller.undo} type="button">
                  Undo
                </button>
              ) : null}
            </div>
          ) : null}
        </>
      }
      readOnly={readOnly}
      selectedTitle={selectedTask?.title}
      setDate={setDate}
      setTab={setTab}
      tab={tab}
      taskId={taskId}
      today={today}
    >
      <WorkspacePanels
        busy={busy}
        date={date}
        day={day}
        onAdd={onAdd}
        onEventStatus={onEventStatus}
        onMove={onMove}
        openDay={openDay}
        openTask={openTask}
        readOnly={readOnly}
        selectedTask={selectedTask}
        setDate={setDate}
        setError={setError}
        setTarget={setTarget}
        setTemplateRoot={setTemplateRoot}
        state={state}
        tab={tab}
        taskId={taskId}
        templateRoot={templateRoot}
        treeProps={treeProps}
        update={update}
      />
    </WorkspaceFrame>
  );
}

function activityOnDate(day: Workspace, taskId: string | null, date: string) {
  if (!taskId) return null;
  return day.tasks.find((task) => sameActivity(task, taskId, date)) ?? null;
}

function sameActivity(task: Task, taskId: string, date: string) {
  if (task.id !== taskId || task.archived || task.scope === "template") return false;
  if (task.details.type === "cook") return task.details.mealDate === date;
  return task.date === date;
}
