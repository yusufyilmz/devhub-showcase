"use client";
import { ArrowLeft } from "lucide-react";

import type { Task } from "@shared/lib/types";
import { Button as LibraryButton } from "@shared/ui/button";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

import { TaskBranch, type TaskTreeProps } from "@/features/task-tree/task-tree";

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
      <div className="section-heading [position:sticky] [top:118px] [align-self:start] [&_.eyebrow]:[margin-bottom:12px] [&_h2]:[margin-bottom:16px] [font-size:30px] [font-weight:600] [line-height:1.25] [letter-spacing:-0.04em] [&_>_p:last-child]:[font-size:13px] [line-height:1.7] [color:var(--muted-foreground)] max-[767px]:[position:static] max-[767px]:[&_h2]:[margin-bottom:8px] [font-size:26px] [display:flex] [gap:14px] [align-items:center] [justify-content:space-between] [margin-bottom:20px] [&_h2]:[display:flex] [gap:8px] max-[700px]:[margin-bottom:16px] max-[700px]:[&_h2]:[font-size:17px]">
        <a
          className="text-btn [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:32px] [padding:4px_0] [font-size:12px] [font-weight:550] [color:var(--ink)] [background:transparent] [border:0] max-[700px]:[font-size:11px] [color:var(--accent)]"
          href={dayHref(date)}
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          <ArrowLeft size={16} />
          Back to day agenda
        </a>
        <span className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)]">
          {date} · {task.time ?? "No time set"}
        </span>
      </div>
      <TaskBranch {...treeProps} parentId={task.parentId} task={task} />
      {task.scope === "scheduled" && (
        <form
          className="card [padding:24px] [margin-bottom:20px] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:12px] max-[700px]:[padding:18px] [box-shadow:0_2px_10px_var(--shadow-color)] reschedule-form [margin-top:24px] [&_.hint]:[margin:10px_0_18px]"
          key={task.id + task.date + task.time}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            onMove(task.id, date, String(f.get("date")), String(f.get("time")) || null);
          }}
        >
          <h2>Reschedule this occurrence</h2>
          <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)]">
            Only this activity moves. The recurring plan stays the same. Reopen completed or skipped
            items before moving them.
          </p>
          <div className="form-grid [display:grid] [grid-template-columns:1fr_1fr] [gap:15px]">
            <LibraryLabel unstyled>
              Date
              <LibraryInput
                defaultValue={task.date ?? date}
                disabled={treeProps.readOnly || treeProps.busy}
                name="date"
                required
                type="date"
                unstyled
              />
            </LibraryLabel>
            <LibraryLabel unstyled>
              Time
              <LibraryInput
                defaultValue={task.time ?? ""}
                disabled={treeProps.readOnly || treeProps.busy}
                name="time"
                type="time"
                unstyled
              />
            </LibraryLabel>
          </div>
          <LibraryButton
            className="primary [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [color:var(--on-primary)] [background:var(--green)] [border:1px_solid_var(--green)] hover:[background:var(--accent)] [background:var(--accent)] [border-color:var(--accent)] [filter:brightness(1.1)]"
            disabled={treeProps.readOnly || treeProps.busy}
            type="submit"
            variant="unstyled"
          >
            Save date and time
          </LibraryButton>
        </form>
      )}
      {task.scope === "generated" && (
        <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)] space-top [margin-top:30px]">
          Generated from your weekly plan. To change a cooking date, move the original meal and
          regenerate the week.
        </p>
      )}
    </section>
  );
}
