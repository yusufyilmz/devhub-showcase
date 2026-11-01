"use client";
import { ArrowLeft } from "lucide-react";

import { TaskBranch, type TaskTreeProps } from "@/features/task-tree/task-tree";
import type { Task } from "@/lib/domain/task";

import { dayHref } from "./use-agenda-navigation";
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
    <section aria-label="Activity details">
      <div className="section-heading">
        <a
          className="text-btn"
          href={dayHref(date)}
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          <ArrowLeft size={16} />
          Back to day agenda
        </a>
        <span className="hint">
          {date} · {task.time ?? "No time set"}
        </span>
      </div>
      <TaskBranch {...treeProps} parentId={task.parentId} task={task} />
      {task.scope === "scheduled" && (
        <form
          className="card reschedule-form"
          key={task.id + task.date + task.time}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            onMove(task.id, date, String(f.get("date")), String(f.get("time")) || null);
          }}
        >
          <h2>Reschedule this occurrence</h2>
          <p className="hint">
            Only this activity moves. The recurring plan stays the same. Reopen completed or skipped
            items before moving them.
          </p>
          <div className="form-grid">
            <label>
              Date
              <input
                defaultValue={task.date ?? date}
                disabled={treeProps.readOnly || treeProps.busy}
                name="date"
                required
                type="date"
              />
            </label>
            <label>
              Time
              <input
                defaultValue={task.time ?? ""}
                disabled={treeProps.readOnly || treeProps.busy}
                name="time"
                type="time"
              />
            </label>
          </div>
          <button className="primary" disabled={treeProps.readOnly || treeProps.busy} type="submit">
            Save date and time
          </button>
        </form>
      )}
      {task.scope === "generated" && (
        <p className="hint space-top">
          Generated from your weekly plan. To change a cooking date, move the original meal and
          regenerate the week.
        </p>
      )}
    </section>
  );
}
