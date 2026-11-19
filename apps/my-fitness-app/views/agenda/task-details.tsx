"use client";
import { ArrowLeft } from "lucide-react";

import { ScheduleFields } from "@shared/calendar/task-form";
import type { Task } from "@shared/lib/types";
import { Button as LibraryButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";

import { TaskBranch, type TaskTreeProps } from "@/views/task-tree/task-tree";

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
        <Card asChild className="mt-5 grid gap-4 p-4 sm:p-5" interaction="static" layout="plain">
          <form
            key={task.id + task.date + task.time}
            onSubmit={(e) => {
              e.preventDefault();
              const fields = new FormData(e.currentTarget);
              onMove(task.id, date, String(fields.get("date")), String(fields.get("time")) || null);
            }}
          >
            <div className="grid gap-1">
              <h2 className="text-base font-semibold">Reschedule this occurrence</h2>
              <p className="text-sm text-muted-foreground">
                Only this activity moves. The recurring plan stays the same. Reopen completed or
                skipped items before moving them.
              </p>
            </div>
            <ScheduleFields
              date={task.date ?? date}
              disabled={treeProps.readOnly || treeProps.busy}
              time={task.time ?? undefined}
            />
            <LibraryButton
              className="justify-self-start"
              disabled={treeProps.readOnly || treeProps.busy}
              type="submit"
            >
              Save date and time
            </LibraryButton>
          </form>
        </Card>
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
