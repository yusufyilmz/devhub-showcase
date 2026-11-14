"use client";

import { Fragment, useLayoutEffect, useRef } from "react";

import { ChevronRight, Pencil } from "lucide-react";

import { TaskService } from "@shared/lib/fitness";
import type { Task } from "@shared/lib/types";
import { Badge } from "@shared/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@shared/ui/breadcrumb";
import { Button } from "@shared/ui/button";

import { TaskFacts, type TaskTreeProps } from "@/features/task-tree/task-tree";

const tasks = new TaskService();

export function subtaskLabel(count: number) {
  return `${count} ${count === 1 ? "subtask" : "subtasks"}`;
}

export function canAddPlanSubtask(task: Task) {
  return !["set", "supplement", "water"].includes(task.kind);
}

export function resolvePlanTaskPath(plan: Task, pathIds: string[], templates: Task[]) {
  const path = [plan];
  let current = plan;
  for (const id of pathIds) {
    const child = templates.find(
      (task) => task.id === id && task.parentId === current.id && !task.archived,
    );
    if (!child) break;
    path.push(child);
    current = child;
  }
  return path;
}

export function PlanTaskList({
  busy,
  current,
  onEdit,
  onNavigate,
  path,
  plan,
  readOnly,
  templates,
}: Pick<TaskTreeProps, "busy" | "onEdit" | "readOnly"> & {
  current: Task;
  onNavigate: (path: Task[]) => void;
  path: Task[];
  plan: Task;
  templates: Task[];
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);

  useLayoutEffect(() => {
    if (shouldFocus.current) {
      heading.current?.focus();
      shouldFocus.current = false;
    }
  });

  const children = tasks.children(templates, current.id);
  const atRoot = current.id === plan.id;
  const canAdd = canAddPlanSubtask(current);

  function navigate(nextPath: Task[]) {
    shouldFocus.current = true;
    onNavigate(nextPath);
  }

  return (
    <section
      aria-labelledby="fitness-plan-tasks-heading"
      className="fitness-plan-tasks [display:grid] [gap:12px] [&_[data-slot='breadcrumb-item']]:[min-width:0] [&_[data-slot='breadcrumb-link']]:[min-height:32px] [&_[data-slot='badge']]:[text-transform:capitalize] [&_.ui-button[data-slot='button'].fitness-plan-task-open:hover]:[color:var(--ink)] [&_.ui-button[data-slot='breadcrumb-link']:hover]:[color:var(--ink)]"
    >
      {!atRoot && (
        <Breadcrumb aria-label="Task hierarchy">
          <BreadcrumbList>
            {path.map((task, index) => (
              <Fragment key={task.id}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {task.id === current.id ? (
                    <BreadcrumbPage>{task.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Button
                        onClick={() => navigate(path.slice(0, index + 1))}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        {task.title}
                      </Button>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <header className="fitness-plan-tasks-header [&_h3]:[margin-top:4px] [font-size:clamp(1.2rem,_3vw,_1.5rem)] [font-weight:650] [letter-spacing:-0.02em] [&_h3:focus-visible]:[outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]:2px_solid_var(--accent)] [outline-offset:4px]">
        {!atRoot && <Badge variant="secondary">{current.kind.replaceAll("_", " ")}</Badge>}
        <h3 id="fitness-plan-tasks-heading" ref={heading} tabIndex={-1}>
          {atRoot ? "Plan tasks" : current.title}
        </h3>
      </header>
      {current.time && (
        <p className="fitness-plan-notes [color:var(--muted)] [max-width:72ch] [white-space:pre-line]">
          Time: {current.time}
        </p>
      )}
      {current.notes && (
        <p className="fitness-plan-notes [color:var(--muted)] [max-width:72ch] [white-space:pre-line]">
          {current.notes}
        </p>
      )}
      <TaskFacts task={current} />
      {current.details.type === "set" && <p>Target: {current.details.targetReps} reps</p>}
      {children.length > 0 ? (
        <ul
          aria-label={`Subtasks of ${current.title}`}
          className="fitness-plan-task-list [&_li_>_button:last-child:not(:first-child)]:[min-width:44px] [min-height:44px] [&_small]:[text-transform:capitalize] [padding:0] [margin:0] [list-style:none] [border-block-start:1px_solid_var(--line)] [&_li]:[display:flex] [gap:6px] [align-items:center] [border-block-end:1px_solid_var(--line)] [&_.fitness-plan-task-open]:[flex:1] [justify-content:space-between] [min-width:0] [height:auto] [min-height:60px] [padding:10px_12px] [text-align:start] [white-space:normal] [&_li_>_.ui-button[data-slot='button']:last-child:hover]:[color:var(--ink)]"
        >
          {children.map((task) => (
            <PlanTaskRow
              count={tasks.children(templates, task.id).length}
              editDisabled={readOnly || busy}
              key={task.id}
              onEdit={() => onEdit(task)}
              onOpen={() => navigate([...path, task])}
              task={task}
            />
          ))}
        </ul>
      ) : (
        canAdd && (
          <p className="fitness-plan-task-empty [color:var(--muted)] [padding-block:12px] [border-block-start:1px_solid_var(--line)]">
            No subtasks yet.
          </p>
        )
      )}
    </section>
  );
}

function PlanTaskRow({
  count,
  editDisabled,
  onEdit,
  onOpen,
  task,
}: {
  count: number;
  editDisabled: boolean;
  onEdit: () => void;
  onOpen: () => void;
  task: Task;
}) {
  return (
    <li>
      <Button
        aria-label={`Open ${task.title}`}
        className="fitness-plan-task-open [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:15px] [font-weight:620] [&_small]:[margin-top:2px] [color:var(--muted)]"
        onClick={onOpen}
        type="button"
        variant="ghost"
      >
        <span>
          <strong>{task.title}</strong>
          <small>
            {task.kind.replaceAll("_", " ")}
            {task.time && ` · ${task.time}`}
            {count > 0 && ` · ${subtaskLabel(count)}`}
          </small>
        </span>
        <ChevronRight aria-hidden="true" />
      </Button>
      {task.kind !== "day" && (
        <Button
          aria-label={`Edit ${task.title}`}
          disabled={editDisabled}
          onClick={onEdit}
          size="icon-lg"
          type="button"
          variant="ghost"
        >
          <Pencil aria-hidden="true" />
        </Button>
      )}
    </li>
  );
}
