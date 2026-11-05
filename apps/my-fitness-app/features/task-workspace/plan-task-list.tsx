"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";

import { ChevronRight, Pencil, Plus } from "lucide-react";

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

function resolvePath(plan: Task, pathIds: string[], templates: Task[]) {
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
  onAdd,
  onEdit,
  plan,
  readOnly,
  templates,
}: Pick<TaskTreeProps, "busy" | "onAdd" | "onEdit" | "readOnly"> & {
  plan: Task;
  templates: Task[];
}) {
  const [pathIds, setPathIds] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);
  const path = resolvePath(plan, pathIds, templates);
  const current = path.at(-1) ?? plan;

  useLayoutEffect(() => {
    if (shouldFocus.current) {
      heading.current?.focus();
      shouldFocus.current = false;
    }
  });

  const children = tasks.children(templates, current.id);
  const atRoot = current.id === plan.id;
  const canAdd = !["set", "supplement", "water"].includes(current.kind);

  function navigate(nextPath: Task[]) {
    shouldFocus.current = true;
    setPathIds(nextPath.slice(1).map((task) => task.id));
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
      <div className="fitness-plan-tasks-header">
        <div>
          {!atRoot && <Badge variant="secondary">{current.kind.replaceAll("_", " ")}</Badge>}
          <h3 id="fitness-plan-tasks-heading" ref={heading} tabIndex={-1}>
            {atRoot ? "Plan tasks" : current.title}
          </h3>
        </div>
        <div className="fitness-plan-task-actions">
          {current.kind !== "day" && (
            <Button
              aria-label={`Edit ${current.title}`}
              disabled={readOnly || busy}
              onClick={() => onEdit(current)}
              size="lg"
              type="button"
              variant="outline"
            >
              <Pencil aria-hidden="true" />
              {atRoot ? "Edit plan" : "Edit task"}
            </Button>
          )}
          {canAdd && (
            <Button
              className="fitness-new-task"
              disabled={readOnly || busy}
              onClick={() => onAdd(current)}
              size="lg"
              type="button"
            >
              <Plus aria-hidden="true" />
              Add subtask
            </Button>
          )}
        </div>
      </div>
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
