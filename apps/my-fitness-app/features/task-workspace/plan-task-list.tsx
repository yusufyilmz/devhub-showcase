"use client";

import { Fragment, useLayoutEffect, useRef } from "react";

import { ChevronRight, Pencil } from "lucide-react";

import { TaskService } from "@shared/services/fitness/task";
import type { Task } from "@shared/services/types";
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
    <section aria-labelledby="fitness-plan-tasks-heading" className="fitness-plan-tasks">
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
      <header className="fitness-plan-tasks-header">
        {!atRoot && <Badge variant="secondary">{current.kind.replaceAll("_", " ")}</Badge>}
        <h3 id="fitness-plan-tasks-heading" ref={heading} tabIndex={-1}>
          {atRoot ? "Plan tasks" : current.title}
        </h3>
      </header>
      {current.time && <p className="fitness-plan-notes">Time: {current.time}</p>}
      {current.notes && <p className="fitness-plan-notes">{current.notes}</p>}
      <TaskFacts task={current} />
      {current.details.type === "set" && <p>Target: {current.details.targetReps} reps</p>}
      {children.length > 0 ? (
        <ul aria-label={`Subtasks of ${current.title}`} className="fitness-plan-task-list">
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
        canAdd && <p className="fitness-plan-task-empty">No subtasks yet.</p>
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
        className="fitness-plan-task-open"
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
