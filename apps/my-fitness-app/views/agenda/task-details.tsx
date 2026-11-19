"use client";

import { AgendaDetails } from "@shared/calendar/agenda-details";
import type { Task } from "@shared/lib/types";

import { TaskBranch, type TaskTreeProps } from "@/views/task-tree/task-tree";

import { dayHref } from "./use-agenda-navigation";

const generatedMessage =
  "Generated from your weekly plan. To change a cooking date, move the original meal and regenerate the week.";

export function TaskDetails({
  task,
  date,
  onBack,
  onMove,
  ...treeProps
}: Omit<TaskTreeProps, "parentId"> & {
  task: Task;
  date: string;
  onBack: () => void;
  onMove: (id: string, from: string, to: string, time: string | null) => void;
}) {
  return (
    <AgendaDetails
      backHref={dayHref(date)}
      date={date}
      disabled={treeProps.readOnly || treeProps.busy}
      formKey={task.id + task.date + task.time}
      generatedMessage={task.scope === "generated" ? generatedMessage : undefined}
      onBack={onBack}
      onReschedule={
        task.scope === "scheduled"
          ? (nextDate, time) => onMove(task.id, date, nextDate, time)
          : undefined
      }
      rescheduleDate={task.date ?? date}
      rescheduleTime={task.time ?? undefined}
      timeLabel={task.time ?? "No time set"}
    >
      <TaskBranch {...treeProps} parentId={task.parentId} task={task} />
    </AgendaDetails>
  );
}
